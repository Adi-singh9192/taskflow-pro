import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Placeholder components for routes
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Boards = React.lazy(() => import('./pages/Boards'));
const BoardView = React.lazy(() => import('./pages/BoardView'));
const Rewards = React.lazy(() => import('./pages/Rewards'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const CouponWallet = React.lazy(() => import('./pages/CouponWallet'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text-muted)]">Loading...</div>;
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <React.Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[var(--color-background)]">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="boards" element={<Boards />} />
              <Route path="boards/:id" element={<BoardView />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="wallet" element={<CouponWallet />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </React.Suspense>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: 'var(--color-card)',
              color: 'var(--color-text-main)',
              border: '1px solid var(--color-border)',
            }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
