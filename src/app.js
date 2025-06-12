import { initImagesToPdf } from '../modules/imagesToPdf.js';
import { initJsonToDataTable } from '../modules/jsonToDataTable.js';
import { initJsonTreeView } from '../modules/jsonTreeView.js';
import { initTaxCalculator } from '../modules/taxCalculator.js';
import { initAbout } from '../modules/about.js';

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
    case '#tax':
      initTaxCalculator(app);
      break;
    default:
      initAbout(app);
  }
}

window.addEventListener('hashchange', () => render(location.hash));
render(location.hash || '#about');

// Dark mode toggle
const btn = document.getElementById('modeToggle');
btn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  btn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
