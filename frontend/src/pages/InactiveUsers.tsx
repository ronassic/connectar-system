import React, { useEffect, useState } from 'react';
import { userService } from '../services/user';
const InactiveUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    
    userService.getInactiveUsers().then(setUsers).catch(console.error);

  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Usuários Inativos</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Último login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString('pt-BR')
                  : 'Nunca'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InactiveUsers;
