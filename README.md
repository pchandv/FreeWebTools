# Free Web Tools PWA

This project is a collection of offline-first tools bundled as a Progressive Web App. It works entirely in the browser and can be hosted statically (e.g., GitHub Pages).

## Features
- **Images to PDF** – combine multiple images into a single PDF file
- **JSON to DataTable** – render JSON arrays as an interactive table
- **JSON Tree View** – explore nested JSON in a collapsible tree
- **PDF to Word** – convert PDF documents to Word
- **Word to PDF** – convert Word documents to PDF
- **Rich WYSIWYG editor** – basic rich‑text editor with Word/PDF import and export
- **XML ↔ JSON** – convert data between XML and JSON formats
- **REST API tester** – send HTTP requests similar to Postman
- **WebSocket tester** – open and debug WebSocket connections (defaults to `wss://ws.postman-echo.com/raw`)
- **About** – information about the app

Additional tools can be added in `modules/`.

## Installation
Clone the repository and install a simple static server (e.g. `npm i -g serve`):

```bash
git clone <repo-url>
cd FreeWebTools
```

## Usage
Navigate using the menu links in `index.html`. Each module runs fully in the browser and requires no backend. Simply open the page and select the desired tool. Conversions happen client side using libraries loaded from CDNs.

## Development Workflow
1. **Serve locally** – run `npx serve` or `python3 -m http.server` in the project root and open the displayed local URL. A local server is required for the service worker.
2. **Build for production** – there is no build step; copy the project files to any static host (GitHub Pages, Netlify, etc.).
3. **Update the service worker** – edit `service-worker.js`, update the `ASSETS` array and bump `CACHE_NAME` whenever you add or remove files so users receive the latest cache.


## Contributing
Pull requests are welcome. New tools should live in `modules/` and be wired up in `src/app.js` and `service-worker.js`. Keep the project lightweight and avoid server-side code.
=======
Service worker enables offline usage after the first load.

## License
This project is licensed under the [MIT License](LICENSE).

