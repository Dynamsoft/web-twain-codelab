// Entry point: wires the page's controls and starts Dynamic Web TWAIN.

import { state, el, useFeeder } from "./shared.js";
import { initDWT, loadSources, acquireFromScanner, loadFromDisk } from "./scanner.js";
import { syncBuffer } from "./buffer.js";
import { readCurrentImage, readAllImages } from "./reader.js";

el.scan.addEventListener("click", acquireFromScanner);
el.refresh.addEventListener("click", loadSources);
el.load.addEventListener("click", loadFromDisk);
el.readCurrent.addEventListener("click", readCurrentImage);
el.readAll.addEventListener("click", readAllImages);

// A face left waiting in feeder mode must not pair with the next flatbed scan.
el.flatbed.addEventListener("change", () => {
	el.duplexOption.hidden = !useFeeder();
	state.pendingDuplexSide = null;
});

el.clear.addEventListener("click", () => {
	state.DWTObject.RemoveAllImages();
	state.pendingDuplexSide = null;
	state.blanksDiscarded = 0;
	syncBuffer(); // also drops the cleared images' results and pairs
});

// One listener for every row: clicking a row jumps the viewer to that image.
el.resultList.addEventListener("click", (event) => {
	const row = event.target.closest(".result-row");
	if (row) state.DWTObject.CurrentImageIndexInBuffer = Number(row.dataset.index);
});

initDWT();
