import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

export const transactionsApi = {
  createOrder: async (data: { userId: number; amount: number }): Promise<ApiResponse> => {
    const url = `${API_BASE}/transactions/create-order`;
    logger.debug(`Calling create order API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  verifyPayment: async (data: { razorpayOrderId: string; razorpayPaymentId: string; signature: string; }): Promise<ApiResponse> => {
    const url = `${API_BASE}/transactions/verify-payment`;
    logger.debug(`Calling verify payment API: ${url}`);
    
    const res = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
