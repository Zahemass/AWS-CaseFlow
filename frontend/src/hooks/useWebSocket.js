import { useEffect, useState, useRef } from 'react';
import { connectWebSocket, closeWebSocket, sendMessage } from '../services/websocket/websocketService';

const useWebSocket = (url, onMessage) => {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = connectWebSocket(url, onMessage);
    setConnected(true);
    return () => {
      closeWebSocket();
      setConnected(false);
    };
  }, [url, onMessage]);

  return { connected, send: sendMessage };
};
export default useWebSocket;

