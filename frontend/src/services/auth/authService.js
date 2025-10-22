// ✅ Modular Amplify v6 Auth API
import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser as amplifyCurrentUser,
} from 'aws-amplify/auth';

import { saveToken, clearToken } from './tokenManager';

/**
 * 🔐 Login User
 */
export const login = async (email, password) => {
  const { isSignedIn, nextStep } = await signIn({ username: email, password });

  if (!isSignedIn && nextStep?.signInStep !== 'DONE') {
    throw new Error('User needs to complete additional verification steps.');
  }

  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (token) saveToken(token);

  return { isSignedIn, session };
};

/**
 * 🆕 Register User
 */
export const register = async (email, password) => {
  return await signUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
    },
  });
};

/**
 * ✅ Confirm User Registration
 */
export const confirmUserSignUp = async (email, code) => {
  return await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
};

/**
 * 🚪 Logout
 */
export const logout = async () => {
  clearToken();
  await signOut();
};

/**
 * 👤 Get Current Authenticated User
 */
export const getCurrentUser = async () => {
  try {
    const user = await amplifyCurrentUser();
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (token) saveToken(token);
    return { user, token };
  } catch {
    return null;
  }
};
