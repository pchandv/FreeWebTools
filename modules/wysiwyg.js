export function initWysiwyg(container) {
  container.innerHTML = `
    <h2>Rich Editor</h2>
    <div id="editor" style="height:200px"></div>
    <input type="file" id="importWord" accept=".doc,.docx" class="form-control mt-2" />
    <button id="exportWord" class="btn btn-secondary mt-2">Export Word</button>
    <button id="exportPdf" class="btn btn-secondary mt-2 ms-2">Export PDF</button>
  `;
  const quill = new Quill('#editor', { theme: 'snow' });
  const importInput = container.querySelector('#importWord');
  importInput.addEventListener('change', async () => {
    if (!importInput.files.length) return;
    const arrayBuffer = await importInput.files[0].arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    quill.root.innerHTML = html;
  });
  container.querySelector('#exportWord').addEventListener('click', async () => {
    const html = quill.root.innerHTML;
    const blob = htmlDocx.asBlob(html);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document.docx';
    link.click();
  });
  container.querySelector('#exportPdf').addEventListener('click', async () => {
    const doc = new jspdf.jsPDF();
    await doc.html(quill.root.innerHTML, { html2canvas: { scale: 0.5 } });
    doc.save('document.pdf');
  });
}
