import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import SIPs from './pages/SIPs';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Register from './pages/Register';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full"
      >
        <Routes location={location}>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/stocks"       element={<Stocks />} />
          <Route path="/sips"         element={<SIPs />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex min-h-dvh w-full bg-[#04070f] pb-[env(safe-area-inset-bottom,0px)]">
                {/* Ambient background */}
                <div className="ambient-bg" />

                <Sidebar />

                <main className="flex-1 min-w-0 md:ml-[240px] transition-all duration-300 w-full overflow-x-hidden relative z-10 pt-[env(safe-area-inset-top,0px)]">
                  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
                    <AnimatedRoutes />
                  </div>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>

        <Toaster
          position="bottom-center"
          gutter={8}
          containerStyle={{
            bottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
            left: 'max(12px, env(safe-area-inset-left, 0px))',
            right: 'max(12px, env(safe-area-inset-right, 0px))',
          }}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(10,16,32,0.95)',
              color: '#f0f4ff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#04070f' } },
            error:   { iconTheme: { primary: '#fb7185', secondary: '#04070f' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
