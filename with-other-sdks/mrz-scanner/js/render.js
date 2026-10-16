// Draws the buffer hint, the results list, and the selected document's details.

import { STATUS_PRECEDENCE, BADGES, state, el, elem, note, plural } from "./shared.js";

const MRZ = Dynamsoft.EnumMRZData;

export function render() {
	const { DWTObject, bufferIds, blanksDiscarded } = state;
	const currentIndex = DWTObject.CurrentImageIndexInBuffer;
	const empty = bufferIds.length === 0;
	el.clear.disabled = empty;
	el.readCurrent.disabled = empty;
	el.readAll.disabled = empty;

	// Discards are reported, otherwise a dropped blank looks like a lost scan.
	const discarded = blanksDiscarded ? ` ${plural(blanksDiscarded, "blank page")} discarded.` : "";
	el.bufferHint.textContent = empty
		? `Buffer is empty. Scan or load an image to begin.${discarded}`
		: `${plural(bufferIds.length, "image")} in the buffer — showing #${currentIndex + 1}.${discarded}`;

	const entries = buildEntries();
	renderList(entries, currentIndex);
	renderDetail(entries.find((e) => e.indices.includes(currentIndex)));
}

// One entry per document, so a duplex pair becomes a single entry.
function buildEntries() {
	const { bufferIds, results, duplexPartners } = state;
	const entries = [];
	const claimed = new Set();

	bufferIds.forEach((imageId, index) => {
		if (claimed.has(imageId)) return;

		// A partner is always later in the buffer, or it would have claimed this face already.
		const partnerIndex = bufferIds.indexOf(duplexPartners.get(imageId));
		const indices = partnerIndex < 0 ? [index] : [index, partnerIndex];
		indices.forEach((i) => claimed.add(bufferIds[i]));

		const records = indices.map((i) => results.get(bufferIds[i]));
		const mrzAt = records.findIndex((r) => r?.status === "found");

		entries.push({
			indices,
			records,
			isPair: indices.length > 1,
			status: STATUS_PRECEDENCE.find((s) => records.some((r) => r?.status === s)),
			mrzIndex: indices[Math.max(mrzAt, 0)], // where clicking the entry takes the viewer
			data: mrzAt >= 0 ? records[mrzAt].data : null,
		});
	});

	return entries;
}

function renderList(entries, currentIndex) {
	const rows = entries.map((entry) => {
		const [first, second] = entry.indices;
		const { className, text } = BADGES[entry.status ?? "unread"];

		const badge = elem("span", `badge ${className}`, text);
		if (entry.status === "reading") badge.prepend(elem("span", "spinner"));

		const row = elem("li", "result-row");
		row.classList.toggle("is-current", entry.indices.includes(currentIndex));
		row.dataset.index = entry.mrzIndex;
		row.append(
			elem("span", "result-index", entry.isPair ? `#${first + 1}–${second + 1}` : `#${first + 1}`),
			elem("span", "result-name", entry.data ? describe(entry.data) : "—"),
			badge,
		);
		return row;
	});

	el.resultList.replaceChildren(...rows);
}

function renderDetail(entry) {
	if (!entry?.status || entry.status === "reading" || entry.status === "queued") {
		el.detail.hidden = true;
		el.detail.replaceChildren();
		return;
	}

	const [first, second] = entry.indices;
	const title = entry.isPair
		? `Images #${first + 1} & #${second + 1} — one document, both faces`
		: `Image #${first + 1}`;

	const children = [elem("h2", null, title), buildImages(entry)];

	if (entry.status === "error") {
		const failed = entry.records.find((r) => r?.status === "error");
		children.push(note(failed?.error || "This image could not be processed."));
	} else if (entry.status === "none") {
		children.push(
			note(
				entry.isPair
					? "Neither face of this document carries a readable MRZ."
					: "No MRZ was found in this image. Back sides of ID cards, cover pages, and blank feeder pages read this way — it is not necessarily an error.",
			),
		);
	} else {
		children.push(buildFields(entry.data));
		if (!entry.records.some((r) => r?.portraitCanvas)) {
			children.push(
				note("No portrait was found. ID cards usually carry it on the other side — scan both sides to include it."),
			);
		}
	}

	el.detail.replaceChildren(...children);
	el.detail.hidden = false;
}

function buildImages(entry) {
	const wrapper = elem("div", "detail-images");

	entry.records.forEach((record, n) => {
		const number = entry.indices[n] + 1;
		const images = [
			[record?.documentCanvas, `Document Image #${number}`],
			[record?.portraitCanvas, `Portrait #${number}`],
		];

		for (const [canvas, caption] of images) {
			if (!canvas) continue;
			const figure = elem("figure");
			figure.append(canvas, elem("figcaption", null, caption));
			wrapper.append(figure);
		}
	});

	return wrapper;
}

function buildFields(data) {
	const invalid = new Set(data[MRZ.InvalidFields] || []);
	const tbody = elem("tbody");

	for (const [key, value] of Object.entries(data)) {
		if (key === MRZ.InvalidFields) continue;

		const row = elem("tr", invalid.has(key) ? "is-invalid" : null);
		row.append(
			elem("th", null, Dynamsoft.MRZDataLabel[key] || key),
			elem("td", key === MRZ.MRZText ? "mrz-text" : null, formatValue(key, value)),
		);
		tbody.append(row);
	}

	const table = elem("table", "field-table");
	table.append(tbody);
	return table;
}

function describe(data) {
	const name = [data[MRZ.LastName], data[MRZ.FirstName]].filter(Boolean).join(", ");
	return [name, data[MRZ.DocumentNumber]].filter(Boolean).join(" · ") || "MRZ";
}

function formatValue(key, value) {
	if (value == null || value === "") return "—";
	if (key === MRZ.DateOfBirth || key === MRZ.DateOfExpiry) return Dynamsoft.displayMRZDate(value);
	return typeof value === "object" ? JSON.stringify(value) : String(value);
}
