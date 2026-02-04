import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Trades } from './pages/Trades';
import { Analytics } from './pages/Analytics';
import { Journal } from './pages/Journal';
import { Learning } from './pages/Learning';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-orange-600">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
      <Route path="/trades" element={user ? <Layout><Trades /></Layout> : <Navigate to="/login" />} />
      <Route path="/analytics" element={user ? <Layout><Analytics /></Layout> : <Navigate to="/login" />} />
      <Route path="/journal" element={user ? <Layout><Journal /></Layout> : <Navigate to="/login" />} />
      <Route path="/learning" element={<Layout><Learning /></Layout>} />
      
      {/* 404 */}
      <Route path="*" element={<div className="p-8 text-center"><h1>404 - Page Not Found</h1></div>} />
    </Routes>
  );
}

export default App;
