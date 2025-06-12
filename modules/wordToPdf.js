export function initWordToPdf(container) {
  container.innerHTML = `
    <h2>Word to PDF</h2>
    <input type="file" id="docxFile" accept=".doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" class="form-control" />
    <button id="wordToPdfBtn" class="btn btn-primary mt-2">Convert to PDF</button>
  `;
  const input = container.querySelector('#docxFile');
  const btn = container.querySelector('#wordToPdfBtn');
  btn.addEventListener('click', async () => {
    if (!input.files.length) return;
    const file = input.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
    const doc = new jspdf.jsPDF();
    await doc.html(html, { html2canvas: { scale: 0.5 } });
    doc.save(file.name.replace(/\.(docx|doc)$/i, '.pdf'));
  });
}
