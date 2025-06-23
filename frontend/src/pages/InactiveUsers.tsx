import React, { useEffect, useState } from 'react';
import { userService } from '../services/user';
import { User } from '../types'; // Importe o tipo User para ter um código mais seguro
import toast from 'react-hot-toast'; // Importe o toast para dar feedback ao usuário

// Interface para usuários inativos, garantindo que lastLogin exista
interface InactiveUser extends User {
  lastLogin?: string;
}

const InactiveUsers: React.FC = () => {
  const [users, setUsers] = useState<InactiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros e ordenação
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('lastLogin'); // Padrão para ordenar por último login
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Estados para controlar o modal de reativação
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [userToReactivate, setUserToReactivate] = useState<User | null>(null);

  // Função para buscar os dados, agora com filtros
  const fetchInactiveUsers = async () => {
    try {
      setLoading(true);
      console.log('Filtros enviados para o serviço:', { roleFilter, sortBy, order });
      const data = await userService.getInactiveUsers(roleFilter || undefined, sortBy, order);
      setUsers(data);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários inativos.');
      console.error('Erro ao buscar usuários inativos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito que executa a busca sempre que um filtro é alterado
  useEffect(() => {
    fetchInactiveUsers();
  }, [roleFilter, sortBy, order]);

  // --- Funções para o Modal de Reativação ---
  const openReactivateModal = (user: User) => {
    setUserToReactivate(user);
    setIsReactivateModalOpen(true);
  };

  const closeReactivateModal = () => {
    setUserToReactivate(null);
    setIsReactivateModalOpen(false);
  };

  const confirmReactivate = async () => {
    if (!userToReactivate) return;

    try {
      // Supondo que você terá uma função para reativar o usuário no seu serviço
      //await userService.reactivateUser(userToReactivate.id);
      toast.success('Usuário reativado com sucesso!');
      closeReactivateModal();
      fetchInactiveUsers(); // Recarrega a lista para remover o usuário reativado daqui
    } catch (error: any) {
      toast.error('Erro ao reativar usuário.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Cabeçalho padronizado */}
      <header className="bg-blue-600 text-white text-center text-2xl font-bold py-4">
        Usuários Inativos
      </header>

      {/* Corpo principal padronizado */}
      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Controles de Filtro e Ordenação */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-end md:justify-center gap-4">
              {/* Perfil */}
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">Perfil:</label>
                <select id="roleFilter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Todos</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              {/* Ordenar por */}
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Ordenar por:</label>
                <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="lastLogin">Último Login</option>
                  <option value="name">Nome</option>
                  <option value="email">Email</option>
                </select>
              </div>
              {/* Ordem */}
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">Ordem:</label>
                <select id="order" value={order} onChange={(e) => setOrder(e.target.value as 'ASC' | 'DESC')} className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="ASC">Crescente</option>
                  <option value="DESC">Decrescente</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-lg text-gray-600">Carregando...</p>
          ) : (
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-400 text-white flex items-center justify-center rounded-full font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                      <p className="text-gray-600 text-sm break-words">{user.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-left sm:text-right">
                    <div className="text-sm text-gray-500">
                      <span>Último login: </span>
                      <span className="font-semibold">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                      </span>
                    </div>
                    {/* NOVO: Botão para Reativar usuário */}
                    {/* <button onClick={() => openReactivateModal(user)} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded w-full sm:w-auto">
                      Reativar
                    </button> */}
                  </div>
                </li>
              ))}
              {users.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <p className="text-gray-500">Nenhum usuário inativo encontrado.</p>
                </div>
              )}
            </ul>
          )}
        </div>
      </main>

      {/* Rodapé padronizado */}
      <footer className="bg-blue-600 text-white text-center text-base py-3">
        &copy; 2025 Minha Empresa
      </footer>

      {/* Modal de Confirmação de Reativação */}
      {isReactivateModalOpen && userToReactivate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Confirmar Reativação</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja reativar o usuário <span className="font-semibold">{userToReactivate.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={closeReactivateModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                Cancelar
              </button>
              <button onClick={confirmReactivate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                Sim, Reativar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InactiveUsers;