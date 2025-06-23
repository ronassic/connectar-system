import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/UserList';
import Profile from './pages/Profile';
import InactiveUsers from './pages/InactiveUsers';

// Layout wrapper que controla exibição condicional do Navbar
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { state } = useAuth();

  const hideNavbarOnRoutes = ['/login', '/register'];

  return (
    <>
      {!hideNavbarOnRoutes.includes(pathname) && !state.loading && <Navbar />}
      {children}
      <Toaster position="top-right" />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inactive-users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <InactiveUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
