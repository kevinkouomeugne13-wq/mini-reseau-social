import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          🌐 MiniSocial
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
                Fil d'actualité
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium">
                Mon Profil ({user.username})
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Connexion
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}