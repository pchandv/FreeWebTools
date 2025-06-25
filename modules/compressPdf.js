export function initCompressPdf(container) {
  container.innerHTML = `
    <h2>Compress PDF under 5MB</h2>
    <input type="file" id="pdfInput" accept="application/pdf" class="form-control" />
    <button id="compressBtn" class="btn btn-primary mt-2">Compress & Download</button>
    <div id="status" class="mt-2 text-danger"></div>
  `;
  const input = container.querySelector('#pdfInput');
  const btn = container.querySelector('#compressBtn');
  const status = container.querySelector('#status');
  btn.addEventListener('click', async () => {
    if (!input.files.length) return;
    const file = input.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const firstPage = await pdf.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });
    const doc = new jspdf.jsPDF({ unit: 'px', format: [firstViewport.width, firstViewport.height] });
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const imgData = canvas.toDataURL('image/jpeg', 0.6);
      if (i > 1) doc.addPage([viewport.width, viewport.height]);
      doc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
    }
    const blob = doc.output('blob');
    if (blob.size <= 5 * 1024 * 1024) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.name.replace(/\.pdf$/i, '-compressed.pdf');
      link.click();
      status.textContent = '';
    } else {
      status.textContent = 'Could not compress below 5MB.';
    }
  });
}
