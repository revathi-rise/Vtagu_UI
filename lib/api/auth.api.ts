import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface AuthResponse {
  status: boolean;
  message: string;
  data?: any;
  token?: string;
}

export const authApi = {
  // Register User
  register: async (data: any): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/register`;
    logger.debug(`Calling register API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Verify OTP
  verifyOtp: async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/verify-otp`;
    logger.debug(`Calling verify-otp API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Login
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/login`;
    logger.debug(`Calling login API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Logout
  logout: async (userId: number): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/logout/${userId}`;
    logger.debug(`Calling logout API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
    });
    return res.json();
  },

  // Forgot Password
  forgotPassword: async (data: { email: string }): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/forgot-password`;
    logger.debug(`Calling forgot-password API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Reset Password
  resetPassword: async (data: any): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/reset-password`;
    logger.debug(`Calling reset-password API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get User Profile
  getProfile: async (userId: number | string): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/get-profile/${userId}`;
    logger.debug(`Calling getProfile API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Update User Profile
  updateProfile: async (userId: number | string, data: any): Promise<AuthResponse> => {
    const url = `${API_BASE}/users/${userId}`;
    logger.debug(`Calling updateProfile API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
