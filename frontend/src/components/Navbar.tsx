import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Gerenciamento de Usuários</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Olá, {state.user?.name} ({state.user?.role})
            </span>
            
            <div className="flex space-x-2">
              {state.user?.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/users')}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Usuários
                </button>
                <button
                  onClick={() => navigate('/inactive-users')}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Inativos
                </button>
              </>
            )}

              
              <button
                onClick={() => navigate('/profile')}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Perfil
              </button>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

