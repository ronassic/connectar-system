import React, { useState, useEffect } from 'react';
import { userService } from '../services/user';
import { User } from '../types';
import toast from 'react-hot-toast'; // Lembre-se de instalar: npm install react-hot-toast

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros e ordenação (reintroduzidos do código antigo)
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Estados para controlar o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Estados para controlar o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(roleFilter || undefined, sortBy, order);
      setUsers(data);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários.');
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para recarregar os dados quando os filtros mudam
  useEffect(() => {
    fetchUsers();
  }, [roleFilter, sortBy, order]);

  // --- Funções para o Modal de Edição ---
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      // Supondo que o estado editingUser contém os dados atualizados do formulário
      await userService.updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      toast.success('Usuário atualizado com sucesso!');
      closeEditModal();
      fetchUsers(); // Recarrega a lista
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar usuário.');
    }
  };

  // --- Funções para o Modal de Exclusão ---
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete.id);
      toast.success('Usuário excluído com sucesso!');
      closeDeleteModal();
      fetchUsers(); // Recarrega a lista
    } catch (error: any) {
      toast.error('Erro ao excluir usuário.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Topo (Layout Mantido) */}
      <header className="bg-blue-600 text-white text-center text-2xl font-bold py-4">
        Lista de Usuários
      </header>

      {/* Corpo (Layout Mantido) */}
      <main className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Controles de Filtro e Ordenação */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-end md:justify-center gap-4">
              {/* Perfil */}
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Perfil:
                </label>
                <select
                  id="roleFilter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Ordenar por */}
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Nome</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {/* Ordem */}
              <div className="flex-1 min-w-[150px]">
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem:
                </label>
                <select
                  id="order"
                  value={order}
                  onChange={(e) => setOrder(e.target.value as 'ASC' | 'DESC')}
                  className="custom-select w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
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
                <li
                  key={user.id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                      <p className="text-gray-600 text-sm break-words">{user.email}</p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
               {users.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">Nenhum usuário encontrado com os filtros atuais.</p>
                    </div>
                )}
            </ul>
          )}
        </div>
      </main>

      {/* Rodapé (Layout Mantido) */}
      <footer className="bg-blue-600 text-white text-center text-base py-3">
        &copy; 2025 Minha Empresa
      </footer>

      {/* Modal de Edição */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Editar Usuário</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  id="name"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Perfil</label>
                <select
                  id="role"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'user' })}
                  className="custom-select mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={closeEditModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o usuário <span className="font-semibold">{userToDelete.name}</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-4">
                <button onClick={closeDeleteModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                  Cancelar
                </button>
                <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Sim, Excluir
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;