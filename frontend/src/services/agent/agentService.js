import { askBedrock } from './agentApi';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { createAWSClients } from '../../config/aws.config';
import { getToken } from '../auth/tokenManager';

export const runAgentPrompt = async (prompt) => {
  const token = getToken();
  const { bedrockClient } = createAWSClients(token);
  const cmd = new InvokeAgentCommand({
    agentId: import.meta.env.VITE_BEDROCK_AGENT_ID,
    agentAliasId: import.meta.env.VITE_BEDROCK_AGENT_ALIAS_ID,
    sessionId: `session-${Date.now()}`,
    inputText: prompt,
  });
  const response = await bedrockClient.send(cmd);
  return response.outputText;
};

export const invokeLambdaFallback = async (text) => await askBedrock(text);
