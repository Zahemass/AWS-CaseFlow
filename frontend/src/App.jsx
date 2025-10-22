import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from '@/routes/AppRoutes';

// ✅ Add this import (Amplify modular v6 setup)
//import { configureAmplifyAuth } from './services/auth/cognitoConfig';
import '@/config/aws.config'; // ✅ ensures Amplify Storage + Auth configured

// Styles
import './App.css';
import './styles/global.css';

// ✅ Configure Amplify Auth before rendering the app
//configureAmplifyAuth();

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <div className="app-container">
              <AppRoutes />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
