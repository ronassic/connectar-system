import React, { useState } from 'react'; // Importe useState
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom'; // Importe Link se quiser que o Gerenciamento de Usuários seja um link
import toast from 'react-hot-toast'; // Adicionado para exibir mensagem de logout

const Navbar: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar o menu móvel

  const handleLogout = () => {
    // Certifique-se de que authService.logout() remove o token e o usuário do localStorage
    authService.logout(); // Isso deve limpar o token e o usuário do localStorage
    localStorage.removeItem('token'); // Garante a remoção, se authService.logout() não fizer
    localStorage.removeItem('user'); // Garante a remoção, se authService.logout() não fizer
    dispatch({ type: 'LOGOUT' });
    toast.success('Logout realizado com sucesso!'); // Feedback visual para o usuário
    navigate('/login');
  };

  // Se o usuário não estiver autenticado, a Navbar não é exibida
  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16"> {/* Adicionei items-center */}
          <div className="flex items-center">
            {/* O título pode ser um link para a página principal do usuário */}
            <Link to={state.user?.role === 'admin' ? '/users' : '/profile'} className="text-xl font-bold">
              Gerenciamento de Usuários
            </Link>
          </div>

          {/* Botão de Hambúrguer - Visível apenas em telas pequenas */}
          <div className="flex items-center lg:hidden"> {/* Só mostra em telas menores que LG */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Ícone de hambúrguer ou 'x' dependendo do estado */}
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Links e Botões do Menu - Visíveis em telas grandes, ocultos em pequenas */}
          <div className="hidden lg:flex items-center space-x-4"> {/* Oculta em telas pequenas */}
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

      {/* Menu Móvel (colapsável) - Aparece apenas em telas pequenas */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <span className="block px-3 py-2 rounded-md text-base font-medium text-blue-100">
            Olá, {state.user?.name} ({state.user?.role})
          </span>

          {state.user?.role === 'admin' && (
            <>
              <button
                onClick={() => { navigate('/users'); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              >
                Usuários
              </button>
              <button
                onClick={() => { navigate('/inactive-users'); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              >
                Inativos
              </button>
            </>
          )}

          <button
            onClick={() => { navigate('/profile'); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
          >
            Perfil
          </button>

          <button
            onClick={() => { handleLogout(); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 text-white transition-colors mt-2"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;