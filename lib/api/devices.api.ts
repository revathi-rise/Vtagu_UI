import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const devicesApi = {
  // Register Device
  register: async (data: any): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/register`;
    logger.debug(`Calling register device API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get All Devices (User)
  getAll: async (userId: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/user/${userId}`;
    logger.debug(`Calling getAll devices API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Get Active Devices (User)
  getActive: async (userId: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/user/${userId}/active`;
    logger.debug(`Calling getActive devices API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Get Single Device
  getById: async (id: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/${id}`;
    logger.debug(`Calling getById device API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Update Device
  update: async (id: number, data: any): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/${id}`;
    logger.debug(`Calling update device API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Deactivate Device
  deactivate: async (id: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/${id}/deactivate`;
    logger.debug(`Calling deactivate device API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
    });
    return res.json();
  },

  // Remove Device
  remove: async (id: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/${id}`;
    logger.debug(`Calling remove device API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Logout All Other Devices
  logoutOthers: async (userId: number, deviceId: string): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/user/${userId}/logout-others/${deviceId}`;
    logger.debug(`Calling logoutOthers devices API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
    });
    return res.json();
  }
};
