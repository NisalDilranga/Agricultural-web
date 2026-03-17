import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import AboutUs from './pages/AboutUs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Shared layout for all public pages
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-[#faf8f5] text-slate-900">
    <Header />
    {children}
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Routes>
        {/* ── Public pages ── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/course/:id" element={<PublicLayout><CourseDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />

        {/* ── Admin pages ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
