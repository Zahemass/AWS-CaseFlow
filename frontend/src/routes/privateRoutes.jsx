import React from 'react';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import CasesPage from '../pages/Cases/CasesPage';
import CaseDetailPage from '../pages/Cases/CaseDetailPage';
import DocumentsPage from '../pages/Documents/DocumentsPage';
import AnalysisPage from '../pages/Analysis/AnalysisPage';
import { ROUTE_PATHS } from '../constants/routeConstants';
import AgentPage from '../pages/Agent/AgentPage'; 

const privateRoutes = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: ROUTE_PATHS.CASES,
    element: <CasesPage />,
  },
  {
    path: ROUTE_PATHS.CASE_DETAIL,
    element: <CaseDetailPage />,
  },
  {
    path: ROUTE_PATHS.DOCUMENTS,
    element: <DocumentsPage />,
  },
  {
    path: ROUTE_PATHS.ANALYSIS,
    element: <AnalysisPage />,
  },
  {
    path: ROUTE_PATHS.AGENT_CHAT, 
    element: <AgentPage />,
  },
];

export default privateRoutes;
