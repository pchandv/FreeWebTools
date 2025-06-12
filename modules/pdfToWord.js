export function initPdfToWord(container) {
  container.innerHTML = `
    <h2>PDF to Word</h2>
    <input type="file" id="pdfFile" accept="application/pdf" class="form-control" />
    <button id="pdfToWordBtn" class="btn btn-primary mt-2">Convert to Word</button>
  `;
  const input = container.querySelector('#pdfFile');
  const btn = container.querySelector('#pdfToWordBtn');
  btn.addEventListener('click', async () => {
    if (!input.files.length) return;
    const file = input.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(' ') + '\n';
    }
    // create a simple docx with the extracted text
    const doc = new docx.Document({
      sections: [{ properties: {}, children: [new docx.Paragraph(text)] }]
    });
    const blob = await docx.Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name.replace(/\.pdf$/i, '.docx');
    link.click();
  });
}
