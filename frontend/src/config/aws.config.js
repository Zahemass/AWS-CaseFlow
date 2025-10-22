import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BedrockAgentRuntimeClient } from '@aws-sdk/client-bedrock-agent-runtime';
import { Amplify } from 'aws-amplify';


// AWS Region
export const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';

// Cognito Configuration
export const COGNITO_CONFIG = {
  region: AWS_REGION,
  userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
  userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
  identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
};

// S3 Configuration
export const S3_CONFIG = {
  region: import.meta.env.VITE_AWS_S3_REGION || AWS_REGION,
  bucket: import.meta.env.VITE_AWS_S3_BUCKET,
  level: 'public',
};

// DynamoDB Configuration
export const DYNAMODB_CONFIG = {
  region: AWS_REGION,
  tables: {
    documents: import.meta.env.VITE_DYNAMODB_DOCUMENTS_TABLE,
    cases: import.meta.env.VITE_DYNAMODB_CASES_TABLE,
    analysis: import.meta.env.VITE_DYNAMODB_ANALYSIS_TABLE,
  },
};

// Bedrock Configuration
export const BEDROCK_CONFIG = {
  region: AWS_REGION,
  agentId: import.meta.env.VITE_BEDROCK_AGENT_ID,
  agentAliasId: import.meta.env.VITE_BEDROCK_AGENT_ALIAS_ID,
  knowledgeBaseId: import.meta.env.VITE_BEDROCK_KNOWLEDGE_BASE_ID,
};

// Create AWS SDK clients with credentials
export const createAWSClients = (idToken) => {
  const credentials = fromCognitoIdentityPool({
    clientConfig: { region: AWS_REGION },
    identityPoolId: COGNITO_CONFIG.identityPoolId,
    logins: {
      [`cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_CONFIG.userPoolId}`]: idToken,
    },
  });

  return {
    s3Client: new S3Client({
      region: S3_CONFIG.region,
      credentials,
    }),
    dynamoDBClient: new DynamoDBClient({
      region: AWS_REGION,
      credentials,
    }),
    bedrockClient: new BedrockAgentRuntimeClient({
      region: AWS_REGION,
      credentials,
    }),
  };
};

// Export pre-configured clients for unauthenticated use
export const cognitoIdentityClient = new CognitoIdentityClient({
  region: AWS_REGION,
});

// ✅ Initialize Amplify for S3 uploads
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: COGNITO_CONFIG.userPoolId,
      userPoolClientId: COGNITO_CONFIG.userPoolClientId,
      identityPoolId: COGNITO_CONFIG.identityPoolId,
      region: COGNITO_CONFIG.region,
    },
  },
  Storage: {
    S3: {
      bucket: S3_CONFIG.bucket,
      region: S3_CONFIG.region,
      defaultAccessLevel: 'public',
    },
  },
});

console.log('✅ Amplify Storage configured for bucket:', S3_CONFIG.bucket);
