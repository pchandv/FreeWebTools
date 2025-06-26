import { initImagesToPdf } from '../modules/imagesToPdf.js';
import { initJsonToDataTable } from '../modules/jsonToDataTable.js';
import { initJsonTreeView } from '../modules/jsonTreeView.js';
import { initAbout } from '../modules/about.js';
import { initPdfToWord } from '../modules/pdfToWord.js';
import { initWordToPdf } from '../modules/wordToPdf.js';
import { initWysiwyg } from '../modules/wysiwyg.js';
import { initXmlJson } from '../modules/xmlJson.js';
import { initApiTester } from '../modules/apiTester.js';
import { initWebsocketTester } from '../modules/websocketTester.js';
import { initCompressPdf } from '../modules/compressPdf.js';
import { initImageOcr } from '../modules/imageOcr.js';

const app = document.getElementById('app');

function render(hash) {
  app.innerHTML = '';
  switch (hash) {
    case '#images':
      initImagesToPdf(app);
      break;
    case '#datatable':
      initJsonToDataTable(app);
      break;
    case '#tree':
      initJsonTreeView(app);
      break;
    case '#pdftoword':
      initPdfToWord(app);
      break;
    case '#wordtopdf':
      initWordToPdf(app);
      break;
    case '#compresspdf':
      initCompressPdf(app);
      break;
    case '#ocr':
      initImageOcr(app);
      break;
    case '#editor':
      initWysiwyg(app);
      break;
    case '#xmljson':
      initXmlJson(app);
      break;
    case '#apitester':
      initApiTester(app);
      break;
    case '#websocket':
      initWebsocketTester(app);
      break;
    default:
      initAbout(app);
  }
}

window.addEventListener('hashchange', () => render(location.hash));
render(location.hash || '#about');

// Dark mode toggle with persistence
const btn = document.getElementById('modeToggle');

function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  document.body.classList.toggle('light-mode', !dark);
  btn.textContent = dark ? 'Light Mode' : 'Dark Mode';
}

// Apply saved preference on startup
applyTheme(localStorage.getItem('theme') === 'dark');

btn.addEventListener('click', () => {
  const useDark = !document.body.classList.contains('dark-mode');
  applyTheme(useDark);
  localStorage.setItem('theme', useDark ? 'dark' : 'light');
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(reg => {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        if (confirm('A new version is available. Reload now?')) {
          reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      }
    });
  });
}
