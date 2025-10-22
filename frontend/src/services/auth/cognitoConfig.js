import { Amplify } from 'aws-amplify';
import { S3_CONFIG } from '@/config/aws.config';

/**
 * ✅ One-time Amplify v6 Auth + Storage configuration
 */
export const configureAmplifyAuth = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        region: import.meta.env.VITE_AWS_REGION,
        userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
        identityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
      },
    },
    Storage: {
      S3: {
        region: S3_CONFIG.region,
        bucket: S3_CONFIG.bucket,
      },
    },
  });

  console.log('✅ bucket connected:',);
};
