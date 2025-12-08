import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import LoginPage from './pages/login'
import SignupPage from './pages/signup'
import { Toaster } from 'react-hot-toast'
import { createContext, useContext, useState } from 'react'
import Dashboard from './pages/dashboard'

export const AuthContext = createContext(null);

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  return authenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
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
