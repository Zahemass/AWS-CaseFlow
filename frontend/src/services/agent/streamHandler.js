export const handleStreamResponse = async (stream, onMessage) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) onMessage(decoder.decode(value));
  }
};
