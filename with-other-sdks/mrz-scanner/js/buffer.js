// Keeps the sample in step with the Web TWAIN buffer: new images, duplex pairs, blank pages.

import { state, el, useDuplex } from "./shared.js";
import { enqueue, queueRead, checkLicense } from "./reader.js";
import { render } from "./render.js";

/* ── Buffer synchronization ──────────────────────────────────────────────── */

export function syncBuffer(info) {
	const { DWTObject, results, duplexPartners } = state;

	// An edit invalidates the image's result — a rotation can even make an unreadable MRZ readable.
	if (info?.action === "modify") results.delete(info.modifiedId);

	const previous = new Set(state.bufferIds);
	state.bufferIds = [];
	for (let index = 0; index < DWTObject.HowManyImagesInBuffer; index++) {
		state.bufferIds.push(DWTObject.IndexToImageID(index));
	}

	// Forget images that have left the buffer.
	const present = new Set(state.bufferIds);
	for (const imageId of results.keys()) {
		if (!present.has(imageId)) results.delete(imageId);
	}
	for (const imageId of duplexPartners.keys()) {
		if (!present.has(imageId)) duplexPartners.delete(imageId);
	}

	const added = state.bufferIds.filter((id) => !previous.has(id));
	if (added.length > 0) {
		if (useDuplex()) pairDuplexFaces(added);
		enqueue(() => admitImages(added));
	}

	render();
}

// Duplex faces arrive one at a time, so pair each new face with the one before it.
function pairDuplexFaces(added) {
	for (const imageId of added) {
		if (state.pendingDuplexSide) {
			state.duplexPartners.set(state.pendingDuplexSide, imageId);
			state.duplexPartners.set(imageId, state.pendingDuplexSide);
			state.pendingDuplexSide = null;
		} else {
			state.pendingDuplexSide = imageId;
		}
	}
}

// Discards blank pages, then auto-reads the rest. A discarded back leaves its front unpaired.
async function admitImages(added) {
	const { DWTObject } = state;
	const kept = [];

	for (const imageId of added) {
		const index = DWTObject.ImageIDToIndex(imageId);
		if (index < 0) continue;

		// Express catches trimmed TWAIN backs; Async catches a blank card on a black ICA page.
		const blank =
			el.discardBlanks.checked &&
			(DWTObject.IsBlankImageExpress(index) || (await DWTObject.IsBlankImageAsync(index)));

		if (blank) {
			// Indices can shift while Async runs, so look this one up again.
			DWTObject.RemoveImage(DWTObject.ImageIDToIndex(imageId));
			state.blanksDiscarded += 1;
		} else {
			kept.push(imageId);
		}
	}

	if (el.auto.checked && kept.length > 0 && (await checkLicense())) kept.forEach(queueRead);
}
