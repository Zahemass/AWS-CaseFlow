import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

export const cognitoClient = new CognitoIdentityClient({
  region: import.meta.env.VITE_AWS_REGION,
});

export const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION,
  s3Bucket: import.meta.env.VITE_S3_BUCKET,
  cognitoPoolId: import.meta.env.VITE_COGNITO_POOL_ID,
  identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
};
