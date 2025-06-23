const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Authentication API calls
export const auth = {
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return await response.json() as ApiResponse<{ token: string; user: any }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to login. Please try again.',
      } as ApiResponse<never>;
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });
      return await response.json() as ApiResponse<{ token: string; user: any }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to register. Please try again.',
      } as ApiResponse<never>;
    }
  },

  async getProfile(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json() as ApiResponse<{ user: any }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch profile.',
      } as ApiResponse<never>;
    }
  },
};

// Transactions API calls
export const transactions = {
  async getAll(token: string, page = 1, limit = 10) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transactions?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return await response.json() as ApiResponse<{ transactions: any[] }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch transactions.',
      } as ApiResponse<never>;
    }
  },

  async create(token: string, data: { amount: number; description: string; category: string; tags?: string[] }) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json() as ApiResponse<{ transaction: any }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create transaction.',
      } as ApiResponse<never>;
    }
  },

  async update(token: string, id: number, data: Partial<{ amount: number; description: string; category: string; tags: string[] }>) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json() as ApiResponse<{ transaction: any }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to update transaction.',
      } as ApiResponse<never>;
    }
  },

  async delete(token: string, id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json() as ApiResponse<{ message: string }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to delete transaction.',
      } as ApiResponse<never>;
    }
  },

  async getStats(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json() as ApiResponse<{
        categoryStats: { category: string; total_amount: number; transaction_count: number }[];
        tagStats: { tag: string; total_amount: number; transaction_count: number }[];
      }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to fetch transaction statistics.',
      } as ApiResponse<never>;
    }
  },
};

// Settings API calls
export const settings = {
  async updateProfile(token: string, data: { name?: string; email?: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json() as ApiResponse<{ user: any }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to update profile.',
      } as ApiResponse<never>;
    }
  },

  async changePassword(token: string, data: { currentPassword: string; newPassword: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json() as ApiResponse<{ message: string }>;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to change password.',
      } as ApiResponse<never>;
    }
  },
};
