import { useState } from 'react';
import { runAgentPrompt } from '../services/agent/agentService';

const useAgent = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAgent = async (prompt) => {
    setLoading(true);
    try {
      const reply = await runAgentPrompt(prompt);
      setResponse(reply);
    } catch (err) {
      console.error('Agent error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, askAgent };
};
export default useAgent;
