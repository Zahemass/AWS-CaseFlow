import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ROUTE_PATHS } from '../constants/routeConstants';

// Layouts & Pages
import MainLayout from '../components/Layout/MainLayout/MainLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import CasesPage from '../pages/Cases/CasesPage';
import CaseDetailPage from '../pages/Cases/CaseDetailPage';
import DocumentsPage from '../pages/Documents/DocumentsPage';
import AnalysisPage from '../pages/Analysis/AnalysisPage';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import AgentPage from '../pages/Agent/AgentPage';

// Route definitions
import privateRoutes from './privateRoutes';
import publicRoutes from './publicRoutes';
import ProtectedRoute from '../components/Auth/ProtectedRoute/ProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuthContext();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }, idx) => (
          <Route key={idx} path={path} element={element} />
        ))}

        {/* Private Routes */}
        {privateRoutes.map(({ path, element }, idx) => (
          <Route
            key={idx}
            path={path}
            element={
              <ProtectedRoute user={user}>
                <MainLayout>{element}</MainLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Redirect root to Dashboard if logged in */}
        <Route
          path="/"
          element={<Navigate to={user ? ROUTE_PATHS.DASHBOARD : ROUTE_PATHS.LOGIN} replace />}
        />

        {/* Catch-all (404) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
