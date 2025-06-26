export function initWebsocketTester(container) {
  container.innerHTML = `
    <h2>WebSocket Tester</h2>
    <div class="input-group">
      <input id="wsUrl" class="form-control" placeholder="wss://ws.postman-echo.com/raw" />
      <span id="wsStatus" class="status-indicator"></span>
    </div>
    <div id="wsError" class="text-danger small mt-1"></div>
    <button id="connect" class="btn btn-primary mt-2">Connect</button>
    <div id="wsControls" style="display:none" class="mt-2">
      <input id="wsMessage" class="form-control" placeholder="Message" />
      <button id="sendMsg" class="btn btn-secondary mt-2">Send</button>
      <button id="close" class="btn btn-danger mt-2 ms-2">Close</button>
    </div>
    <div id="history" class="message-history mt-3"></div>
  `;

  let socket;
  let reconnectDelay = 1000;
  let manualClose = false;

  const statusEl = container.querySelector('#wsStatus');
  const historyEl = container.querySelector('#history');
  const connectBtn = container.querySelector('#connect');

  function setStatus(state) {
    statusEl.className = 'status-indicator ' + state;
  }

  function addMessage(type, msg) {
    const div = document.createElement('div');
    const prefix = type === 'send' ? '>>' : type === 'recv' ? '<<' : '!!';
    div.textContent = `[${new Date().toLocaleTimeString()}] ${prefix} ${msg}`;
    historyEl.appendChild(div);
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  function showError(msg) {
    container.querySelector('#wsError').textContent = msg;
  }

  function connect() {
    const url = container.querySelector('#wsUrl').value.trim();
    if (!/^wss?:\/\//.test(url)) {
      showError('Invalid WebSocket URL');
      return;
    }
    showError('');
    manualClose = false;
    connectBtn.classList.add('loading');
    setStatus('connecting');
    socket = new WebSocket(url);
    addMessage('info', 'Connecting to ' + url);
    socket.addEventListener('open', () => {
      setStatus('connected');
      connectBtn.classList.remove('loading');
      container.querySelector('#wsControls').style.display = '';
      reconnectDelay = 1000;
      addMessage('info', 'Connected');
    });
    socket.addEventListener('message', e => addMessage('recv', e.data));
    socket.addEventListener('close', () => {
      setStatus('');
      connectBtn.classList.remove('loading');
      container.querySelector('#wsControls').style.display = 'none';
      addMessage('info', 'Closed');
      if (!manualClose) {
        setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30000);
      }
    });
    socket.addEventListener('error', e => {
      console.error(e);
      addMessage('error', e.message || 'Error');
    });
  }

  connectBtn.addEventListener('click', connect);

  container.querySelector('#sendMsg').addEventListener('click', () => {
    const msg = container.querySelector('#wsMessage').value;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
      addMessage('send', msg);
    }
  });

  container.querySelector('#close').addEventListener('click', () => {
    manualClose = true;
    socket?.close();
  });

  setStatus('');
}
