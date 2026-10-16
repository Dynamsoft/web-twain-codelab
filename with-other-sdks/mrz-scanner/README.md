# Dynamic Web TWAIN + Dynamsoft MRZ Scanner

This sample scans passports, ID cards, and visas with
[Dynamic Web TWAIN](https://www.dynamsoft.com/web-twain/overview/) and reads their
Machine-Readable Zone (MRZ) with the Dynamsoft MRZ Scanner. For each passport or card, it
shows the parsed MRZ fields, a cropped image of the card or passport page, and the
holder's portrait when one is found.

## Running the sample

Open `index.html` through a local web server rather than from your file system. The
scripts are ES modules, and browsers do not load modules from `file://` URLs. Any
lightweight static server works. In VS Code, for example, the **Five Server** extension
serves the page at `http://127.0.0.1:5500/` when you click **Go Live**.

Plain HTTP is fine on `localhost`. To open the sample from another machine on your
network, serve it over HTTPS.

Both SDKs load from the jsDelivr CDN, and the Dynamic Web TWAIN Service installers load
from unpkg. The machine running the browser needs the **Dynamic Web TWAIN Service**. If it
is not installed, the page prompts you to download it.

### Licenses

Each SDK needs its own license key. Set them in `DWT_LICENSE_KEY` and `MRZ_LICENSE_KEY` at
the top of `js/shared.js`. The public trial key included in the sample stops working after
24 hours of use. You can request a free trial key for each product at
[dynamsoft.com/customer/license/trialLicense](https://www.dynamsoft.com/customer/license/trialLicense).

Loading PDFs with **Load File** may also need the PDF Rasterizer module in your Web TWAIN
license. Web TWAIN reads PDFs made only of images on its own, but it uses the PDF
Rasterizer to convert any other PDF into images. Trial licenses include the PDF Rasterizer.
For details, see
[supported file formats](https://www.dynamsoft.com/web-twain/docs/introduction/supported-file-formats.html#pdf).

The Web TWAIN version is set in two places, `DWT_VERSION` in `js/shared.js` and the
`<script>` tag in `index.html`, so update both together.

## Scanning and reading options

| Option                        | What it does                                                                                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Flatbed**               | Scans from the glass instead of the document feeder. The feeder is the default because most scanners have one. Use the flatbed for passports.                 |
| **Duplex (both faces)**       | Feeder only. Scans both sides of each card and shows them as one row in the results, because ID cards often print the MRZ and the portrait on different sides. |
| **Discard blank pages**       | Removes blank pages as they arrive, such as the empty back of a one-sided card. See [Blank pages](#blank-pages).                                              |
| **Read MRZ automatically…**   | Reads each image as soon as it arrives in the viewer.                                                                                                         |
| **Read Current Image**        | Reads the image shown in the viewer, and the other side too if the image is part of a duplex pair.                                                            |
| **Read All Images**           | Reads every image that has not been read yet.                                                                                                                 |
| **Load File**                 | Loads an image or PDF from disk instead of scanning. Some PDFs need the PDF Rasterizer in your Web TWAIN license; see [Licenses](#licenses).                  |

## How the two SDKs work together

Dynamic Web TWAIN controls the scanner and keeps the scanned pages in its image buffer.
The MRZ Scanner reads them. For most scans, passing a page from one to the other takes a
single call:

```js
const result = await mrzScanner.launch(DWTObject.GetImageURL(index));
```

`GetImageURL()` returns a URL that the local Dynamic Web TWAIN Service serves, and
`launch()` downloads the image from that URL. The service allows these cross-origin
requests, so no extra setup is needed.

Scans that the scanner has already cropped to the card take a different path, described
in [Scans already cropped by the scanner](#scans-already-cropped-by-the-scanner).

### Core integration and optional parts

The rest of the sample builds on that one call. If you are adapting it:

- **Core:** Web TWAIN setup and scanning (`js/scanner.js`), the `launch()` call
  (`readImage()` in `js/reader.js`), and the table of MRZ fields (`buildFields()` in
  `js/render.js`). `js/shared.js` holds the license keys and the state these files share.
- **Needed for the cropped image and the portrait:** the custom template
  (`assets/mrz-template.json`) and the black border added to pre-cropped scans
  (`js/reader.js`).
- **Optional:** duplex pairing and discarding blank pages (`js/buffer.js`), automatic
  reading, Read All, and the results list. All reads go through one queue (`enqueue()` in
  `js/reader.js`), because `launch()` throws an error if it is called again before the
  previous read finishes. If you remove the queue, make sure reads still cannot overlap.

## Cropped images of the card or passport

Along with the MRZ fields, the MRZ Scanner returns a cropped and straightened image of the
card or passport page, plus the holder's portrait when it finds one. To crop, it looks for
the edges of the card against the background around it. Two parts of the sample keep this
working with different scanners.

### Scans already cropped by the scanner

Many TWAIN card scanners crop each scan to the edges of the card. That leaves no background
around the card, so the MRZ Scanner has no edges to find, and it crops the image
differently every time. The sample treats a scan as pre-cropped when it is about
passport-page size or smaller, which it works out from the image's pixel size and DPI.
Scans with no DPI value are never treated as pre-cropped. For these scans, the sample:

1. Copies the scan out of Web TWAIN with `ConvertToBlob()` and draws it on a canvas with a
   black border. This gives the MRZ Scanner edges to find the card and its portrait.
2. Shows the original scan, without the border, as the cropped image.

This step is required for consistent results. No template setting replaces it.

### The custom template

The sample loads `assets/mrz-template.json` instead of the MRZ Scanner's default template.
Only the part that finds the edges of the card or passport is changed:

| Scan                                     | What the template changes                                                                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Passport on the glass of a flatbed       | Edge detection runs on a copy scaled down to 1024 px on its shorter side, with settings tuned for a pale passport on a white background.       |
| ID card on a large black page (macOS ICA) | `MinQuadrilateralAreaRatio: 5` lets the card take up as little as 5% of the image. The default setting ignores a card at about 10% of the page. |

MRZ reading and parsing are unchanged, and the cropped image still comes from the
full-resolution scan. The template keeps only `ReadAll`, the one template the sample uses.

## Blank pages

Scanning a one-sided card in duplex mode produces a blank back. With
**Discard blank pages** on, the sample checks each image as it arrives, removes the blank
ones, and shows how many it removed below the viewer.

Scanner drivers deliver a blank card back in different ways, so the sample uses two
Web TWAIN checks and removes an image if either one finds it blank:

1. `IsBlankImageExpress()` runs first because it is fast. It handles the blank back of a
   card that a TWAIN driver has cropped to size.
2. `IsBlankImageAsync()` runs only when the first check finds content. It handles a blank
   card on a large black page, which is what the macOS ICA driver delivers.

The sample removes blank pages itself instead of using the driver's
`IfAutoDiscardBlankpages` option. If the driver removed them, one-sided cards would arrive
as one image and two-sided cards as two, and duplex pairing would link the wrong sides.

## Known limitations

- **A passport or card touching the edge of the glass** comes back uncropped. With no
  background on that side, the MRZ Scanner cannot find its outline.
- **An ID card pressed against the top of a macOS ICA scanner's card slot** can lose a
  strip along its top edge in the cropped image, for the same reason.

## Files

| File                        | Purpose                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `index.html`                | Page markup, SDK script tags, off-screen MRZ Scanner host   |
| `js/main.js`                | Entry point: wires the page's controls and starts Web TWAIN |
| `js/shared.js`              | License keys, configuration, shared state, DOM helpers      |
| `js/scanner.js`             | Web TWAIN setup, scanner list, scanning, loading files      |
| `js/buffer.js`              | Buffer sync, duplex pairing, blank-page discarding          |
| `js/reader.js`              | MRZ reading, border for pre-cropped scans, read queue       |
| `js/render.js`              | Results list and the details of each passport or card       |
| `assets/mrz-template.json`  | MRZ Scanner template with tuned edge detection              |
| `assets/style.css`          | Layout and presentation                                     |
| `assets/dynamsoft-logo.svg` | Header logo                                                 |
