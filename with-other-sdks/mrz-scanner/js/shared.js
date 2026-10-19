// Configuration, shared state, and DOM helpers used across the sample.

/* ── Configuration ───────────────────────────────────────────────────────── */

// Each SDK is licensed separately: https://www.dynamsoft.com/customer/license/trialLicense
export const DWT_LICENSE_KEY = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAwLTEwMzk4OTAwMyIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbS8iLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMCIsInN0YW5kYnlTZXJ2ZXJVUkwiOiJodHRwczovL3NsdHMuZHluYW1zb2Z0LmNvbS8iLCJjaGVja0NvZGUiOjk0NTQ3NzkxMX0=";
export const MRZ_LICENSE_KEY = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAwLTEwMzk4OTAwMyIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbS8iLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMCIsInN0YW5kYnlTZXJ2ZXJVUkwiOiJodHRwczovL3NsdHMuZHluYW1zb2Z0LmNvbS8iLCJjaGVja0NvZGUiOjk0NTQ3NzkxMX0=";

export const DWT_VERSION = "19.4.4"; // keep in step with the Web TWAIN <script> tag in index.html

// When a pair's two faces disagree, the status listed first wins.
export const STATUS_PRECEDENCE = ["found", "reading", "queued", "error", "none"];

export const BADGES = {
	found: { className: "badge-found", text: "MRZ found" },
	reading: { className: "badge-pending", text: "Reading…" },
	queued: { className: "badge-pending", text: "Queued" },
	error: { className: "badge-error", text: "Error" },
	none: { className: "badge-none", text: "No MRZ" },
	unread: { className: "badge-unread", text: "Not read" },
};

/* ── State ───────────────────────────────────────────────────────────────── */

// Buffer indices shift as images come and go, so everything is keyed by image ID.
export const state = {
	DWTObject: null,
	bufferIds: [],
	results: new Map(), // imageId → { status, data, documentCanvas, portraitCanvas, error }
	duplexPartners: new Map(),
	pendingDuplexSide: null, // a face waiting for its partner to arrive
	blanksDiscarded: 0,
};

/* ── DOM ─────────────────────────────────────────────────────────────────── */

export const $ = (id) => document.getElementById(id);

export const el = {
	banner: $("banner"),
	bufferHint: $("buffer-hint"),
	sources: $("source-list"),
	refresh: $("btn-refresh"),
	scan: $("btn-scan"),
	load: $("btn-load"),
	clear: $("btn-clear"),
	flatbed: $("chk-flatbed"),
	auto: $("chk-auto"),
	duplexOption: $("duplex-option"),
	duplex: $("chk-duplex"),
	discardBlanks: $("chk-blank"),
	readCurrent: $("btn-read-current"),
	readAll: $("btn-read-all"),
	resultList: $("result-list"),
	detail: $("detail"),
};

export function elem(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text != null) node.textContent = text;
	return node;
}

export const note = (text) => elem("p", "note", text);
export const errorMessage = (error) => error?.message || String(error);
export const plural = (count, noun) => `${count} ${noun}${count === 1 ? "" : "s"}`;
export const useFeeder = () => !el.flatbed.checked;
export const useDuplex = () => useFeeder() && el.duplex.checked;

export function showBanner(message, kind = "error") {
	el.banner.textContent = message;
	el.banner.className = kind === "warn" ? "banner warn" : "banner";
	el.banner.hidden = false;
}
