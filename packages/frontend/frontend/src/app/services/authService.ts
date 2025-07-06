import axios from 'axios';

import { API_URL } from '../config';

export class AuthService {
  static login(credentials: { email: string; password: string }) {
    return axios.post(`${API_URL}/auth/login`, credentials);
  }

  static register(userData: { email: string; password: string; name: string }) {
    return axios.post(`${API_URL}/auth/register`, userData);
  }

  static logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return Promise.resolve();
  }

  static async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    localStorage.setItem('accessToken', response.data.tokens.accessToken);
    localStorage.setItem('refreshToken', response.data.tokens.refreshToken);

    return response.data;
  }

  static getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
