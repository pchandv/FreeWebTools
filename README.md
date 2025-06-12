# Free Web Tools PWA

This project is a collection of offline-first tools bundled as a Progressive Web App.
It works entirely in the browser and can be hosted statically (e.g., GitHub Pages).

## Features
- Multiple Images to PDF converter
- JSON to DataTable viewer
- JSON Tree View
- PDF to Word converter
- Word to PDF converter
- Rich WYSIWYG editor with import/export for Word and PDF
- XML↔JSON converter
- Postman-like REST API tester
- WebSocket test suite
- The WebSocket tester defaults to `wss://ws.postman-echo.com/raw` for echo tests
- About page

Additional tools can be added in `modules/`.

## Usage
Navigate using the menu links in `index.html`. Each module runs fully in the
browser and requires no server. Simply open the page and select the desired
tool. Conversions happen client side using libraries loaded from CDNs.

## Development
Simply open `index.html` in a modern browser or serve the directory with a static server.

Service worker enables offline usage after the first load.
