export function initWebsocketTester(container) {
  container.innerHTML = `
    <h2>WebSocket Tester</h2>
    <input id="wsUrl" class="form-control" placeholder="wss://echo.websocket.org" />
    <button id="connect" class="btn btn-primary mt-2">Connect</button>
    <div id="wsControls" style="display:none" class="mt-2">
      <input id="wsMessage" class="form-control" placeholder="Message" />
      <button id="sendMsg" class="btn btn-secondary mt-2">Send</button>
      <button id="close" class="btn btn-danger mt-2 ms-2">Close</button>
    </div>
    <pre id="log" class="mt-3"></pre>
  `;
  let socket;
  const log = msg => {
    container.querySelector('#log').textContent += msg + '\n';
  };
  container.querySelector('#connect').addEventListener('click', () => {
    const url = container.querySelector('#wsUrl').value;
    socket = new WebSocket(url);
    log('Connecting to ' + url);
    socket.addEventListener('open', () => {
      log('Connected');
      container.querySelector('#wsControls').style.display = '';
    });
    socket.addEventListener('message', e => log('<< ' + e.data));
    socket.addEventListener('close', () => log('Closed'));
    socket.addEventListener('error', e => log('Error: ' + e));
  });
  container.querySelector('#sendMsg').addEventListener('click', () => {
    const msg = container.querySelector('#wsMessage').value;
    socket.send(msg);
    log('>> ' + msg);
  });
  container.querySelector('#close').addEventListener('click', () => socket.close());
}
