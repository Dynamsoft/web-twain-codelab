// MRZ Scanner: reads buffer images one at a time and stores each result.

import { MRZ_LICENSE_KEY, state, elem, errorMessage, showBanner } from "./shared.js";
import { render } from "./render.js";

let mrzScanner = null;
let licenseValid = null; // Promise<boolean>, created on first read

// Blank screening and reads share one chain, since launch() throws if called twice at once.
let queue = Promise.resolve();

/* ── Reading ─────────────────────────────────────────────────────────────── */

function getMRZScanner() {
	if (!mrzScanner) {
		mrzScanner = new Dynamsoft.MRZScanner({
			license: MRZ_LICENSE_KEY,
			container: "#mrzScannerHost",
			// The library's default template, with document detection tuned for flatbed and ICA scans.
			templateFilePath: new URL("assets/mrz-template.json", location.href).href,
			// Web TWAIN already shows the original, so only the derived images are needed.
			returnOriginalImage: false,
			returnDocumentImage: true,
			returnPortraitImage: true,
		});
	}
	return mrzScanner;
}

// launch() alert()s license errors per image, so check once up front; a failure retries next read.
export function checkLicense() {
	if (!licenseValid) {
		licenseValid = Dynamsoft.LicenseManager.initLicense(MRZ_LICENSE_KEY, { executeNow: true }).then(
			() => true,
			(error) => {
				showBanner(`The MRZ Scanner license is not valid: ${errorMessage(error)}`);
				licenseValid = null;
				return false;
			},
		);
	}
	return licenseValid;
}

async function readImage(imageId) {
	const { DWTObject, results } = state;
	const index = DWTObject.ImageIDToIndex(imageId);
	if (index < 0) return; // removed from the buffer while queued

	results.set(imageId, { status: "reading" });
	render();

	try {
		// Required: a trimmed scan needs a black border, or its crop and portrait vary per scan.
		const scan = isTrimmedToDocument(index) ? await getScanBitmap(index) : null;
		const source = scan ? drawOnCanvas(scan, 0.25) : DWTObject.GetImageURL(index);
		const result = await getMRZScanner().launch(source);

		// A read that returns no result is treated as a failure.
		const failed = !result || result.status === Dynamsoft.EnumResultStatus.RS_FAILED;
		const hasData = result?.data && Object.keys(result.data).length > 0;
		results.set(imageId, {
			status: failed ? "error" : hasData ? "found" : "none",
			data: hasData ? result.data : null,
			documentCanvas: scan
				? drawOnCanvas(scan)
				: result?.getDocumentImage(Dynamsoft.EnumDocumentSide.MRZ)?.toCanvas(),
			portraitCanvas: result?.getPortraitImage()?.toCanvas(),
			error: failed ? "The MRZ Scanner could not process this image." : null,
		});
	} catch (error) {
		results.set(imageId, { status: "error", error: errorMessage(error) });
	}

	render();
}

// True when the scanner trimmed the scan to the document (no bigger than a passport page).
function isTrimmedToDocument(index) {
	const { DWTObject } = state;
	const dpi = DWTObject.GetImageXResolution(index);
	if (!dpi) return false; // unknown scale, so leave the cropping to the scanner

	const width = DWTObject.GetImageWidth(index);
	const height = DWTObject.GetImageHeight(index);
	return Math.max(width, height) <= 6.1 * dpi && Math.min(width, height) <= 4.3 * dpi;
}

// A Web TWAIN blob is same-origin, so it can be drawn to a canvas without any CORS setup.
function getScanBitmap(index) {
	return new Promise((resolve, reject) => {
		state.DWTObject.ConvertToBlob(
			[index],
			Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
			(blob) => resolve(createImageBitmap(blob)),
			(code, message) => reject(new Error(message || `ConvertToBlob failed (${code})`)),
		);
	});
}

// Draws the bitmap onto a new canvas, with a black border of `padding` x its size per side.
function drawOnCanvas(bitmap, padding = 0) {
	const padX = Math.round(bitmap.width * padding);
	const padY = Math.round(bitmap.height * padding);

	const canvas = elem("canvas");
	canvas.width = bitmap.width + padX * 2;
	canvas.height = bitmap.height + padY * 2;

	const context = canvas.getContext("2d");
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(bitmap, padX, padY);
	return canvas;
}

/* ── Read queue ──────────────────────────────────────────────────────────── */

export function enqueue(task) {
	queue = queue.then(task).catch((error) => console.error(error));
}

// Marked "queued" straight away, so an image already waiting or being read is never queued twice.
export function queueRead(imageId) {
	const status = state.results.get(imageId)?.status;
	if (status === "queued" || status === "reading") return;

	state.results.set(imageId, { status: "queued" });
	render();
	enqueue(() => readImage(imageId));
}

// Picks images inside the queue so blank screening finishes first; either face reads a pair.
export function readCurrentImage() {
	const current = state.bufferIds[state.DWTObject.CurrentImageIndexInBuffer];

	enqueue(async () => {
		const ids = [current, state.duplexPartners.get(current)].filter((id) => state.bufferIds.includes(id));
		if (ids.length > 0 && (await checkLicense())) ids.forEach(queueRead);
	});
}

// Skips images already read; editing an image clears its result, so it is read again.
export function readAllImages() {
	enqueue(async () => {
		const unread = state.bufferIds.filter((id) => !state.results.has(id));
		if (unread.length > 0 && (await checkLicense())) unread.forEach(queueRead);
	});
}
