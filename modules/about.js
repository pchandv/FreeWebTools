import { APP_VERSION } from '../version.js';

export function initAbout(container) {
  container.innerHTML = `
    <h2>About Free Web Tools</h2>
    <p>Version ${APP_VERSION}</p>
    <p>Free Web Tools is a set of offline-first utilities for working with images, PDF, Word documents and data formats directly in your browser.</p>
    <p class="mt-2">Credits: built on top of open source libraries including PDF-Lib, jsPDF, Mammoth, Quill and more.</p>
    <p><a href="https://github.com/" target="_blank">GitHub Repo</a> | <a href="CHANGELOG.md" target="_blank">Release Notes</a></p>
    <p><a href="privacy.html" target="_blank">Privacy</a> | <a href="CHANGELOG.md" target="_blank">Changelog</a></p>
  `;
}
