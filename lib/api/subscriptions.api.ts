import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const subscriptionsApi = {
  // Create Subscription
  create: async (data: any): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions`;
    logger.debug(`Calling create subscription API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Get All Subscriptions
  getAll: async (): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions`;
    logger.debug(`Calling getAll subscriptions API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Get Subscription by ID
  getById: async (id: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions/${id}`;
    logger.debug(`Calling getById subscription API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Get Active Subscription (User)
  getActive: async (userId: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions/user/${userId}/active`;
    logger.debug(`Calling getActive subscription API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Get Subscription History (User)
  getHistory: async (userId: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions/user/${userId}/history`;
    logger.debug(`Calling getHistory subscription API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'GET',
    });
    return res.json();
  },

  // Update Subscription
  update: async (id: number, data: any): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions/${id}`;
    logger.debug(`Calling update subscription API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Cancel Subscription
  cancel: async (id: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/subscriptions/${id}`;
    logger.debug(`Calling cancel subscription API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    return res.json();
  }
};
