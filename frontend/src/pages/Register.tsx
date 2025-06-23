import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const hasNameError = !name.trim();
    const hasEmailError = !email || !emailRegex.test(email);
    const hasPasswordError = !password || password.length < 6;

    setNameError(hasNameError);
    setEmailError(hasEmailError);
    setPasswordError(hasPasswordError);

    if (hasNameError || hasEmailError || hasPasswordError) {
      if (hasNameError) toast.error('Nome é obrigatório');
      else if (hasEmailError) toast.error('Email inválido');
      else toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ name, email, password });
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full md:max-w-md bg-white p-6 sm:p-8 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Crie sua conta
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                nameError ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Nome completo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(false);
              }}
            />
          </div>

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
              autoComplete="new-password"
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
