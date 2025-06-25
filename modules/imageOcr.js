export function initImageOcr(container) {
  container.innerHTML = `
    <h2>Image OCR</h2>
    <input type="file" id="ocrImage" accept="image/*" class="form-control" />
    <button id="ocrBtn" class="btn btn-primary mt-2">Extract Text</button>
    <pre id="ocrResult" class="mt-3"></pre>
  `;
  const input = container.querySelector('#ocrImage');
  const btn = container.querySelector('#ocrBtn');
  const result = container.querySelector('#ocrResult');
  btn.addEventListener('click', async () => {
    if (!input.files.length) return;
    const file = input.files[0];
    result.textContent = 'Processing...';
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      result.textContent = text;
    } catch (e) {
      result.textContent = 'Error: ' + e;
    }
  });
}
