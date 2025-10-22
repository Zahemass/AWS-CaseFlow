let ws = null;

export const connectWebSocket = (url, onMessage) => {
  ws = new WebSocket(url);

  ws.onopen = () => console.log('[WebSocket] Connected');
  ws.onmessage = (msg) => onMessage?.(JSON.parse(msg.data));
  ws.onclose = () => console.warn('[WebSocket] Disconnected');
  ws.onerror = (err) => console.error('[WebSocket] Error', err);

  return ws;
};

export const sendMessage = (data) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
};

export const closeWebSocket = () => {
  if (ws) ws.close();
};
