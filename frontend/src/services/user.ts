import api from './api';
import { User, UpdateUserData } from '../types';

export const userService = {
  async getUsers(role?: string, sortBy?: string, order?: string): Promise<User[]> {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (sortBy) params.append('sortBy', sortBy);
    if (order) params.append('order', order);
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getInactiveUsers(
    role?: string,
    sortBy?: string,
    order?: 'ASC' | 'DESC'
  ): Promise<User[]> {
    const response = await api.get('/users/inactive', {
      // A mágica acontece aqui, no objeto 'params'
      params: {
        role,   // Adiciona ?role=... se 'role' for definido
        sortBy, // Adiciona &sortBy=... se 'sortBy' for definido
        order,  // Adiciona &order=... se 'order' for definido
      },
    });
    return response.data;
  },
};

