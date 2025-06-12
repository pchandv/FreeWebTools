export function initXmlJson(container) {
  container.innerHTML = `
    <h2>XML ↔ JSON</h2>
    <textarea id="xmlInput" class="form-control" rows="4" placeholder="<root></root>"></textarea>
    <button id="toJson" class="btn btn-primary mt-2">XML to JSON</button>
    <textarea id="jsonOutput" class="form-control mt-2" rows="4" placeholder="{}"></textarea>
    <button id="toXml" class="btn btn-secondary mt-2">JSON to XML</button>
  `;
  const x2js = new X2JS();
  container.querySelector('#toJson').addEventListener('click', () => {
    try {
      const xml = container.querySelector('#xmlInput').value;
      const obj = x2js.xml2js(xml);
      container.querySelector('#jsonOutput').value = JSON.stringify(obj, null, 2);
    } catch {
      alert('Invalid XML');
    }
  });
  container.querySelector('#toXml').addEventListener('click', () => {
    try {
      const obj = JSON.parse(container.querySelector('#jsonOutput').value);
      container.querySelector('#xmlInput').value = x2js.js2xml(obj);
    } catch {
      alert('Invalid JSON');
    }
  });
}
