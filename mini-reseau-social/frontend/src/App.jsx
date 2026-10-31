import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Login from './pages/Login';
// Vous pouvez créer un Register.jsx sur le même modèle que Login.jsx si ce n'est pas fait
import Register from './pages/Register'; 
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="py-6">
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}