import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasEmailError = !email || !emailRegex.test(email);
    const hasPasswordError = !password || password.length < 6;

    setEmailError(hasEmailError);
    setPasswordError(hasPasswordError);

    if (hasEmailError || hasPasswordError) {
      if (!email || !password) toast.error('Preencha todos os campos');
      else if (hasEmailError) toast.error('Email inválido');
      else toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.login({ email, password });

      if (!response || !response.access_token) {
        throw new Error('Credenciais inválidas');
      }

      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.access_token },
      });

      toast.success('Login realizado com sucesso!');

      // Aguarde um pouco antes de navegar
      setTimeout(() => {
        navigate(response.user.role === 'admin' ? '/users' : '/profile');
      }, 300); // 300ms para garantir exibição do toast

    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const message =
        error.response?.data?.message || error.message || 'Erro ao fazer login';

      toast.error(message);
      setLoginError(message); // Se você quiser mostrar na tela também
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full md:max-w-md bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Faça login em sua conta
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
          </div>

          {loginError && (
            <p className="text-red-600 text-sm text-center font-medium">{loginError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>

          
        </form>
      </div>
    </div>
  );
};

export default Login;
