export function initJsonTreeView(container) {
  container.innerHTML = `
    <h2>JSON Tree View</h2>
    <textarea id="treeInput" class="form-control" rows="6" placeholder='{ "a": 1 }'></textarea>
    <button id="treeBtn" class="btn btn-primary mt-2">Render Tree</button>
    <pre id="treeOutput" class="mt-3"></pre>
  `;
  container.querySelector('#treeBtn').addEventListener('click', () => {
    const input = container.querySelector('#treeInput').value;
    try {
      const json = JSON.parse(input);
      container.querySelector('#treeOutput').textContent = JSON.stringify(json, null, 2);
    } catch {
      alert('Invalid JSON');
    }
  });
}
