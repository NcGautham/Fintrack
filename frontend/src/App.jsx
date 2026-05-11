import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import SIPs from './pages/SIPs';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-[var(--color-surface-primary)]">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300 w-full overflow-x-hidden">
                  {/* Background effects */}
                  <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-600/3 rounded-full blur-3xl" />
                  </div>

                  <div className="relative z-10 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/stocks" element={<Stocks />} />
                        <Route path="/sips" element={<SIPs />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </AnimatePresence>
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#162040',
              color: '#e2e8f0',
              border: '1px solid rgba(91, 124, 250, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#fff' },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
