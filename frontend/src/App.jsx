import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import { Toaster } from 'react-hot-toast'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Dashboard from './pages/dashboard'

export const AuthContext = createContext(null);

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  return authenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('authenticated');
    return savedAuth === 'true';
  });
  const [loading, setLoading] = useState(true);

  const handleSetAuthenticated = (value) => {
    setAuthenticated(value);
    localStorage.setItem('authenticated', value);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const localToken = localStorage.getItem('authToken');
        if (localToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${localToken}`;
        }
        const response = await axios.get('http://localhost:3000/api/auth/verify', { withCredentials: true });
        if (response.data && response.data.authenticated) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthenticated(false);
      localStorage.removeItem('authenticated');
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated: handleSetAuthenticated, logout }}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<div>404 Not Found !</div>} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
