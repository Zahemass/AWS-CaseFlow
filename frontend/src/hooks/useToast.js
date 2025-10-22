import { useCallback, useState } from 'react';

const useToast = () => {
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(''), []);

  return { toast, showToast, clearToast };
};
export default useToast;
