export function initImagesToPdf(container) {
  container.innerHTML = `
    <h2>Images to PDF</h2>
    <input type="file" id="imgFiles" multiple accept="image/*" class="form-control" />
    <button id="convertBtn" class="btn btn-primary mt-2">Convert & Download</button>
    <div id="imgPreview" class="mt-3"></div>
  `;
  const input = container.querySelector('#imgFiles');
  const btn = container.querySelector('#convertBtn');
  const preview = container.querySelector('#imgPreview');
  input.addEventListener('change', () => {
    preview.innerHTML = '';
    Array.from(input.files).forEach(f => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(f);
      img.style.maxWidth = '100px';
      img.className = 'm-1';
      preview.appendChild(img);
    });
  });
  btn.addEventListener('click', async () => {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    for (const file of input.files) {
      const imgBytes = await file.arrayBuffer();
      let img;
      if (file.type === 'image/png') {
        img = await pdfDoc.embedPng(imgBytes);
      } else {
        img = await pdfDoc.embedJpg(imgBytes);
      }
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'images.pdf';
    link.click();
  });
}
