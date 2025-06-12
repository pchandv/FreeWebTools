export function initImagesToPdf(container) {
  container.innerHTML = `
    <h2>Images to PDF</h2>
    <p class="text-muted">Select or drop images below. Drag to reorder or use the arrow buttons. Use the rotate icon to rotate an image before conversion.</p>
    <input type="file" id="imgFiles" multiple accept="image/*" class="form-control" />
    <div id="dropZone" class="border rounded p-3 text-center mt-2" style="min-height:80px">Drop images here</div>
    <div id="imgPreview" class="mt-3 list-group"></div>
    <button id="convertBtn" class="btn btn-primary mt-2">Convert & Download</button>
  `;

  const input = container.querySelector('#imgFiles');
  const dropZone = container.querySelector('#dropZone');
  const btn = container.querySelector('#convertBtn');
  const preview = container.querySelector('#imgPreview');
  let images = [];

  function addFiles(fileList) {
    Array.from(fileList).forEach(f => {
      if (f.type.startsWith('image/')) {
        images.push({ file: f, rotation: 0 });
      }
    });
    renderPreview();
  }

  function renderPreview() {
    preview.innerHTML = '';
    images.forEach((imgObj, idx) => {
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex align-items-center gap-2';
      item.draggable = true;
      item.dataset.index = idx;
      item.innerHTML = `
        <span class="handle" style="cursor: grab;">&#9776;</span>
        <img src="${URL.createObjectURL(imgObj.file)}" style="max-width:80px; transform: rotate(${imgObj.rotation}deg);"/>
        <div class="btn-group btn-group-sm ms-auto">
          <button class="btn btn-secondary rotate" title="Rotate 90°">&#8635;</button>
          <button class="btn btn-secondary up" title="Move up">&#8593;</button>
          <button class="btn btn-secondary down" title="Move down">&#8595;</button>
        </div>
      `;
      preview.appendChild(item);
    });
  }

  input.addEventListener('change', () => {
    addFiles(input.files);
    input.value = '';
  });

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('bg-light');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('bg-light'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('bg-light');
    addFiles(e.dataTransfer.files);
  });

  preview.addEventListener('click', e => {
    const item = e.target.closest('.list-group-item');
    if (!item) return;
    const idx = Number(item.dataset.index);
    if (e.target.classList.contains('rotate')) {
      images[idx].rotation = (images[idx].rotation + 90) % 360;
      renderPreview();
    } else if (e.target.classList.contains('up') && idx > 0) {
      [images[idx - 1], images[idx]] = [images[idx], images[idx - 1]];
      renderPreview();
    } else if (e.target.classList.contains('down') && idx < images.length - 1) {
      [images[idx + 1], images[idx]] = [images[idx], images[idx + 1]];
      renderPreview();
    }
  });

  let dragSrc;
  preview.addEventListener('dragstart', e => {
    const item = e.target.closest('.list-group-item');
    if (!item) return;
    dragSrc = Number(item.dataset.index);
    e.dataTransfer.effectAllowed = 'move';
  });

  preview.addEventListener('dragover', e => {
    e.preventDefault();
  });

  preview.addEventListener('drop', e => {
    e.preventDefault();
    const target = e.target.closest('.list-group-item');
    if (!target && dragSrc !== undefined) return;
    const dest = Number(target.dataset.index);
    const [moved] = images.splice(dragSrc, 1);
    images.splice(dest, 0, moved);
    renderPreview();
  });

  function rotateImage(file, rotation) {
    if (rotation === 0) return file.arrayBuffer().then(buffer => ({ buffer, width: null, height: null }));
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        canvas.toBlob(blob => {
          const reader = new FileReader();
          reader.onload = () => resolve({ buffer: reader.result, width: canvas.width, height: canvas.height });
          reader.readAsArrayBuffer(blob);
        }, file.type);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  btn.addEventListener('click', async () => {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();

    for (const imgObj of images) {
      const rotated = await rotateImage(imgObj.file, imgObj.rotation);
      const imgBytes = rotated.buffer || (await imgObj.file.arrayBuffer());
      let img;
      if (imgObj.file.type === 'image/png') {
        img = await pdfDoc.embedPng(imgBytes);
      } else {
        img = await pdfDoc.embedJpg(imgBytes);
      }
      const width = rotated.width || img.width;
      const height = rotated.height || img.height;
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(img, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'images.pdf';
    link.click();
  });
}
