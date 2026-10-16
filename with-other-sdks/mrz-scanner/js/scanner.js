// Dynamic Web TWAIN: setup, scanner list, scanning, and loading files.

import { DWT_LICENSE_KEY, DWT_VERSION, state, $, el, errorMessage, showBanner, useFeeder, useDuplex } from "./shared.js";
import { syncBuffer } from "./buffer.js";
import { render } from "./render.js";

/* ── Web TWAIN setup ─────────────────────────────────────────────────────── */

export async function initDWT() {
	Dynamsoft.DWT.AutoLoad = false;
	Dynamsoft.DWT.Containers = []; // the viewer is bound manually below
	Dynamsoft.DWT.ProductKey = DWT_LICENSE_KEY;
	Dynamsoft.DWT.ResourcesPath = `https://cdn.jsdelivr.net/npm/dwt@${DWT_VERSION}/dist`;
	// Installers come from unpkg; jsDelivr does not serve those binaries reliably.
	Dynamsoft.DWT.ServiceInstallerLocation = `https://unpkg.com/dwt@${DWT_VERSION}/dist/dist/`;

	try {
		state.DWTObject = await new Promise((resolve, reject) =>
			Dynamsoft.DWT.CreateDWTObjectEx({ WebTwainId: "dwt-mrz" }, resolve, reject),
		);
	} catch (error) {
		showBanner(
			`Dynamic Web TWAIN failed to initialize: ${errorMessage(error)}. ` +
				`Make sure the Dynamic Web TWAIN Service is installed and running.`,
		);
		el.bufferHint.textContent = "Dynamic Web TWAIN unavailable.";
		return;
	}

	const { DWTObject } = state;
	DWTObject.Viewer.bind($("dwtcontrolContainer"));
	DWTObject.Viewer.width = "100%";
	DWTObject.Viewer.height = "100%";
	DWTObject.Viewer.show();

	// Scans, loaded files, discards and edits all arrive through a buffer change.
	DWTObject.RegisterEvent("OnBufferChanged", syncBuffer);
	DWTObject.RegisterEvent("OnTopImageInTheViewChanged", render);

	el.load.disabled = false;
	syncBuffer();
	loadSources();
}

/* ── Acquisition ─────────────────────────────────────────────────────────── */

// Lists scanners in a dropdown instead of SelectSourceAsync()'s native picker dialog.
export async function loadSources() {
	el.sources.disabled = true;
	el.sources.replaceChildren(new Option("Looking for scanners…"));

	let names = [];
	try {
		await state.DWTObject.OpenSourceManagerAsync();
		names = await state.DWTObject.GetSourceNamesAsync(false);
	} catch (error) {
		console.warn("Could not list scanners:", errorMessage(error));
	}

	// Each option's value is the index SelectSourceByIndexAsync() expects.
	if (names.length > 0) {
		el.sources.replaceChildren(...names.map((name, index) => new Option(name, index)));
	} else {
		el.sources.replaceChildren(new Option("No scanner found"));
	}

	el.sources.disabled = names.length === 0;
	el.scan.disabled = names.length === 0;
	el.refresh.disabled = false;
}

export async function acquireFromScanner() {
	const { DWTObject } = state;
	try {
		await DWTObject.SelectSourceByIndexAsync(Number(el.sources.value));
		await DWTObject.OpenSourceAsync();
		// Colour at 300 DPI: MRZ recognition degrades badly on black-and-white scans.
		await DWTObject.AcquireImageAsync({
			IfShowUI: false,
			PixelType: Dynamsoft.DWT.EnumDWT_PixelType.TWPT_RGB,
			Resolution: 300,
			// Set explicitly: left out, some drivers default to an empty feeder and fail.
			IfFeederEnabled: useFeeder(),
			IfDuplexEnabled: useDuplex(),
			IfDisableSourceAfterAcquire: true,
		});
	} catch (error) {
		showBanner(`Scanning failed: ${errorMessage(error)}`, "warn");
	} finally {
		await DWTObject.CloseSourceAsync().catch(() => {}); // fails if the source never opened
	}
}

export function loadFromDisk() {
	// Web TWAIN loads PDF pages straight into the buffer; PDFs that aren't image-only need the PDF Rasterizer license.
	state.DWTObject.LoadImageEx("", Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL, () => {}, (code, message) => {
		const text = String(message || "");
		if (/cancel/i.test(text)) return; // the user closed the file dialog
		showBanner(`Failed to load file: ${text || code}`);
	});
}
