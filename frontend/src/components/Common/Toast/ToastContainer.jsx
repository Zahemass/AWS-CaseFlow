import React, { useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [msg, setMsg] = useState('');
  const show = useCallback((m) => setMsg(m), []);
  const hide = () => setMsg('');
  // usage: import { useToast } hook to call show()
  return msg ? <Toast message={msg} onClose={hide} /> : null;
};
export default ToastContainer;
