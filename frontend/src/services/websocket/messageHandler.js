export const handleMessage = (msg) => {
  switch (msg.type) {
    case 'UPDATE':
      console.log('Update received:', msg.data);
      break;
    case 'ALERT':
      alert(msg.data);
      break;
    default:
      console.log('Unknown message type:', msg);
  }
};
