import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Auth Pages
import LoginPage from '../pages/Auth/LoginPage'
import RegisterPage from '../pages/Auth/RegisterPage'

// Dashboard & Core Pages
import DashboardPage from '../pages/Dashboard/DashboardPage'
import CasesPage from '../pages/Cases/CasesPage'
import DocumentsPage from '../pages/Documents/DocumentsPage'
import AnalysisPage from '../pages/Analysis/AnalysisPage'
import AgentPage from '../pages/Agent/AgentPage' // 🧠 Added AI Agent Page

// Utility Pages
import NotFoundPage from '../pages/NotFound/NotFoundPage'

// Layout Wrapper
import MainLayout from '../components/Layout/MainLayout/MainLayout'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (No Layout) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Application Routes (With Layout) */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        }
      />

      <Route
        path="/cases"
        element={
          <MainLayout>
            <CasesPage />
          </MainLayout>
        }
      />

      <Route
        path="/documents"
        element={
          <MainLayout>
            <DocumentsPage />
          </MainLayout>
        }
      />

      <Route
        path="/analysis"
        element={
          <MainLayout>
            <AnalysisPage />
          </MainLayout>
        }
      />

      {/* 🧠 AI Agent Page */}
      <Route
        path="/agent"
        element={
          <MainLayout>
            <AgentPage />
          </MainLayout>
        }
      />

      {/* Fallback for any undefined route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
