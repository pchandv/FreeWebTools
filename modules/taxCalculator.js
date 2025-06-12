export function initTaxCalculator(container) {
  container.innerHTML = `
    <h2>Income Tax Calculator</h2>
    <div class="mb-3">
      <label class="form-label">Import Form 16 (PDF or TXT)</label>
      <input type="file" id="form16File" accept=".pdf,.txt" class="form-control" />
      <button id="parseForm16" class="btn btn-secondary mt-2">Parse Form 16</button>
      <div id="parseStatus" class="form-text"></div>
    </div>
    <form id="taxForm">
      <div class="row g-2">
        <div class="col-md-4">
          <label class="form-label">Gross Salary</label>
          <input type="number" id="grossSalary" class="form-control" value="0" />
        </div>
        <div class="col-md-4">
          <label class="form-label">HRA Exemption</label>
          <input type="number" id="hra" class="form-control" value="0" />
        </div>
        <div class="col-md-4">
          <label class="form-label">LTA Exemption</label>
          <input type="number" id="lta" class="form-control" value="0" />
        </div>
      </div>
      <div class="row g-2 mt-1">
        <div class="col-md-4">
          <label class="form-label">Other Income</label>
          <input type="number" id="otherIncome" class="form-control" value="0" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Deduction 80C</label>
          <input type="number" id="d80c" class="form-control" value="0" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Deduction 80D</label>
          <input type="number" id="d80d" class="form-control" value="0" />
        </div>
      </div>
      <div class="mt-2">
        <label class="form-label">Other Deductions</label>
        <input type="number" id="otherDed" class="form-control" value="0" />
      </div>
      <button type="button" id="calcBtn" class="btn btn-primary mt-3">Calculate</button>
    </form>
    <div id="results" class="mt-4"></div>
    <canvas id="taxChart" class="mt-3"></canvas>
    <button id="exportPdf" class="btn btn-outline-secondary mt-3">Export Report PDF</button>
    <button id="exportCsv" class="btn btn-outline-secondary mt-3 ms-2">Export CSV</button>
  `;

  const form16Input = container.querySelector('#form16File');
  const parseBtn = container.querySelector('#parseForm16');
  const status = container.querySelector('#parseStatus');

  parseBtn.addEventListener('click', async () => {
    if (!form16Input.files.length) {
      alert('Please choose a Form 16 file');
      return;
    }
    const file = form16Input.files[0];
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const pdf = await pdfjsLib.getDocument({ url: URL.createObjectURL(file) }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(it => it.str).join(' ') + '\n';
        }
      } else {
        text = await file.text();
      }
      fillFromText(text);
      status.textContent = 'Form 16 parsed';
    } catch (e) {
      console.error(e);
      status.textContent = 'Could not parse Form 16';
    }
  });

  function fillFromText(text) {
    const getNum = (regex) => {
      const m = regex.exec(text);
      return m ? Number(m[1].replace(/,/g, '')) : 0;
    };
    document.getElementById('grossSalary').value = getNum(/Gross\s+Salary[^\d]*(\d+[\d,]*)/i);
    document.getElementById('hra').value = getNum(/HRA[^\d]*(\d+[\d,]*)/i);
    document.getElementById('lta').value = getNum(/LTA[^\d]*(\d+[\d,]*)/i);
    document.getElementById('otherIncome').value = getNum(/Other\s+Income[^\d]*(\d+[\d,]*)/i);
    document.getElementById('d80c').value = getNum(/80C[^\d]*(\d+[\d,]*)/i);
    document.getElementById('d80d').value = getNum(/80D[^\d]*(\d+[\d,]*)/i);
    document.getElementById('otherDed').value = getNum(/Total\s+Deductions[^\d]*(\d+[\d,]*)/i);
  }

  container.querySelector('#calcBtn').addEventListener('click', () => {
    const vals = {
      grossSalary: Number(document.getElementById('grossSalary').value) || 0,
      hra: Number(document.getElementById('hra').value) || 0,
      lta: Number(document.getElementById('lta').value) || 0,
      otherIncome: Number(document.getElementById('otherIncome').value) || 0,
      d80c: Number(document.getElementById('d80c').value) || 0,
      d80d: Number(document.getElementById('d80d').value) || 0,
      otherDed: Number(document.getElementById('otherDed').value) || 0,
    };
    const standardDeduction = 50000;
    const taxableOld =
      vals.grossSalary + vals.otherIncome - vals.hra - vals.lta - vals.d80c - vals.d80d - vals.otherDed - standardDeduction;
    const taxableNew = vals.grossSalary + vals.otherIncome - standardDeduction;
    const taxOld = calcOldRegime(taxableOld);
    const taxNew = calcNewRegime(taxableNew);
    showResults(taxOld, taxNew);
  });

  function calcOldRegime(income) {
    let tax = 0;
    const slabs = [
      [250000, 0],
      [500000, 0.05],
      [1000000, 0.2],
    ];
    let remaining = income;
    let lower = 0;
    for (const [limit, rate] of slabs) {
      const taxable = Math.min(remaining, limit - lower);
      if (taxable > 0) tax += taxable * rate;
      remaining -= taxable;
      lower = limit;
    }
    if (remaining > 0) tax += remaining * 0.3;
    return tax + tax * 0.04; // 4% cess
  }

  function calcNewRegime(income) {
    let tax = 0;
    const slabs = [
      [300000, 0],
      [600000, 0.05],
      [900000, 0.1],
      [1200000, 0.15],
      [1500000, 0.2],
    ];
    let remaining = income;
    let lower = 0;
    for (const [limit, rate] of slabs) {
      const taxable = Math.min(remaining, limit - lower);
      if (taxable > 0) tax += taxable * rate;
      remaining -= taxable;
      lower = limit;
    }
    if (remaining > 0) tax += remaining * 0.3;
    return tax + tax * 0.04;
  }

  function showResults(taxOld, taxNew) {
    const resDiv = document.getElementById('results');
    resDiv.innerHTML = `
      <table class="table table-bordered">
        <thead><tr><th></th><th>Old Regime</th><th>New Regime</th></tr></thead>
        <tbody>
          <tr><th>Total Tax (₹)</th><td>${taxOld.toFixed(2)}</td><td>${taxNew.toFixed(2)}</td></tr>
        </tbody>
      </table>`;
    const ctx = document.getElementById('taxChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Old Regime', 'New Regime'],
        datasets: [{
          label: 'Tax Payable',
          data: [taxOld, taxNew],
          backgroundColor: ['#0d6efd', '#198754'],
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    document.getElementById('exportPdf').onclick = () => {
      const doc = new jspdf.jsPDF();
      doc.text('Income Tax Comparison', 10, 10);
      doc.autoTable({ html: resDiv.querySelector('table') });
      doc.save('tax-report.pdf');
    };

    document.getElementById('exportCsv').onclick = () => {
      const csv = `Regime,Tax\nOld,${taxOld.toFixed(2)}\nNew,${taxNew.toFixed(2)}\n`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tax-report.csv';
      link.click();
    };
  }
}
