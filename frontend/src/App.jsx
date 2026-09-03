import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MeetingsList from './pages/MeetingsList';
import MeetingDetail from './pages/MeetingDetail';
import NewMeeting from './pages/NewMeeting';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

function AppLayout({ children }) {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar onRefreshData={() => setRefreshKey((prev) => prev + 1)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full min-w-0" key={refreshKey}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main App Routes wrapped in AppLayout */}
          <Route
            path="/"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/meetings"
            element={
              <AppLayout>
                <MeetingsList />
              </AppLayout>
            }
          />
          <Route
            path="/meetings/:id"
            element={
              <AppLayout>
                <MeetingDetail />
              </AppLayout>
            }
          />
          <Route
            path="/record"
            element={
              <AppLayout>
                <NewMeeting />
              </AppLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <AppLayout>
                <Analytics />
              </AppLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
