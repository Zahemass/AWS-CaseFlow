export const parseError = (err) => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.response?.data?.message) return err.response.data.message;
  if (err.error?.message) return err.error.message;
  return 'An unexpected error occurred.';
};

// Handle error globally (e.g., show toast)
export const handleError = (err, showToast) => {
  const message = parseError(err);
  console.error('[ErrorHandler]', message);
  if (showToast) showToast(message, 'error');
  return message;
};

// Try-catch wrapper for async calls
export const safeAsync = async (fn, onError) => {
  try {
    return await fn();
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
};
