export function initJsonToDataTable(container) {
  container.innerHTML = `
    <h2>JSON to DataTable</h2>
    <textarea id="jsonInput" class="form-control" rows="6" placeholder='[{"name":"Alice","age":30}]'></textarea>
    <button id="tableBtn" class="btn btn-primary mt-2">Generate Table</button>
    <table id="jsonTable" class="table table-striped mt-3" style="display:none"></table>
  `;
  const btn = container.querySelector('#tableBtn');
  btn.addEventListener('click', () => {
    const jsonText = container.querySelector('#jsonInput').value;
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) throw new Error('JSON must be an array');
      const table = container.querySelector('#jsonTable');
      const headers = Object.keys(data[0]);
      table.innerHTML = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
      const body = data.map(row => `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`).join('');
      table.innerHTML += `<tbody>${body}</tbody>`;
      $(table).DataTable();
      table.style.display = '';
    } catch (e) {
      alert('Invalid JSON');
    }
  });
}
