export function initTaxCalculator(container) {
  container.innerHTML = `
    <h2>Tax Calculator</h2>
    <div class="row mb-3">
      <div class="col">
        <input type="number" id="amount" class="form-control" placeholder="Amount" />
      </div>
      <div class="col">
        <input type="number" id="rate" class="form-control" placeholder="Tax Rate (%)" />
      </div>
      <div class="col">
        <button id="calcBtn" class="btn btn-primary w-100">Calculate</button>
      </div>
    </div>
    <table id="resultTable" class="table" style="display:none">
      <thead><tr><th>Subtotal</th><th>Tax Rate</th><th>Tax Amount</th><th>Total</th></tr></thead>
      <tbody></tbody>
    </table>
    <div id="exportBtns" class="mt-2" style="display:none">
      <button id="pdfBtn" class="btn btn-secondary me-2">Export PDF</button>
      <button id="csvBtn" class="btn btn-secondary me-2">Export CSV</button>
      <button id="xlsxBtn" class="btn btn-secondary">Export Excel</button>
    </div>
  `;

  const amountInput = container.querySelector('#amount');
  const rateInput = container.querySelector('#rate');
  const calcBtn = container.querySelector('#calcBtn');
  const table = container.querySelector('#resultTable');
  const tbody = table.querySelector('tbody');
  const exportDiv = container.querySelector('#exportBtns');

  calcBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const tax = amount * rate / 100;
    const total = amount + tax;
    tbody.innerHTML = `<tr><td>${amount.toFixed(2)}</td><td>${rate.toFixed(2)}%</td><td>${tax.toFixed(2)}</td><td>${total.toFixed(2)}</td></tr>`;
    table.style.display = '';
    exportDiv.style.display = '';
  });

  container.querySelector('#pdfBtn').addEventListener('click', async () => {
    const { PDFDocument, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 200]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();
    page.drawText('Tax Calculation', { x: 20, y: height - 30, size: 16, font });
    page.drawText('Subtotal: ' + tbody.children[0].children[0].textContent, { x: 20, y: height - 60, font });
    page.drawText('Tax Rate: ' + tbody.children[0].children[1].textContent, { x: 20, y: height - 80, font });
    page.drawText('Tax Amount: ' + tbody.children[0].children[2].textContent, { x: 20, y: height - 100, font });
    page.drawText('Total: ' + tbody.children[0].children[3].textContent, { x: 20, y: height - 120, font });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tax.pdf';
    link.click();
  });

  container.querySelector('#csvBtn').addEventListener('click', () => {
    const row = Array.from(tbody.querySelectorAll('td')).map(td => td.textContent.replace('%',''));
    const csv = 'Subtotal,Tax Rate,Tax Amount,Total\n' + row.join(',');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tax.csv';
    link.click();
  });

  container.querySelector('#xlsxBtn').addEventListener('click', () => {
    const row = Array.from(tbody.querySelectorAll('td')).map(td => td.textContent);
    const wsData = [['Subtotal','Tax Rate','Tax Amount','Total'], row];
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Tax');
    XLSX.writeFile(wb, 'tax.xlsx');
  });
}
