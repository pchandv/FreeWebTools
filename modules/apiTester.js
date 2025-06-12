export function initApiTester(container) {
  container.innerHTML = `
    <h2>REST API Tester</h2>
    <div class="row g-2">
      <div class="col-md-2"><select id="method" class="form-select"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select></div>
      <div class="col-md-10"><input id="url" class="form-control" placeholder="https://api.example.com"/></div>
    </div>
    <textarea id="headers" class="form-control mt-2" rows="2" placeholder="{\"Content-Type\":\"application/json\"}"></textarea>
    <textarea id="body" class="form-control mt-2" rows="4" placeholder="Request body"></textarea>
    <button id="send" class="btn btn-primary mt-2">Send</button>
    <pre id="response" class="mt-3"></pre>
  `;
  container.querySelector('#send').addEventListener('click', async () => {
    const method = container.querySelector('#method').value;
    const url = container.querySelector('#url').value;
    const headersText = container.querySelector('#headers').value;
    let headers = {};
    try { headers = headersText ? JSON.parse(headersText) : {}; } catch {}
    const body = container.querySelector('#body').value || undefined;
    try {
      const res = await fetch(url, { method, headers, body: ['GET','HEAD'].includes(method)?undefined:body });
      const text = await res.text();
      container.querySelector('#response').textContent = text;
    } catch (e) {
      container.querySelector('#response').textContent = 'Error: ' + e;
    }
  });
}
