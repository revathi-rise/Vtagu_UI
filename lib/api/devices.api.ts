import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server-device';
  let deviceId = localStorage.getItem('vtagu_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('vtagu_device_id', deviceId);
  }
  return deviceId;
}

export function detectDeviceInfo() {
  if (typeof window === 'undefined') {
    return { name: 'Unknown Device', type: 'desktop', os: 'Unknown' };
  }
  const ua = navigator.userAgent;
  let os = 'Windows';
  if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  let type = 'desktop';
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) {
    type = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
  }

  let browser = 'Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  const name = `${browser} on ${os}`;
  return { name, type, os, user_agent: ua };
}

export const devicesApi = {
  // Register Current Device Session
  registerCurrentDevice: async (userId: number): Promise<ApiResponse | null> => {
    try {
      const device_id = getOrCreateDeviceId();
      const info = detectDeviceInfo();
      const payload = {
        userId,
        device_id,
        device_name: info.name,
        device_type: info.type,
        os: info.os,
        user_agent: info.user_agent,
      };
      const url = `${API_BASE}/user-devices/register`;
      const res = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res.json();
    } catch (err) {
      console.error('Failed to register current device session:', err);
      return null;
    }
  },
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

  // Get Device Registration & Limit Status
  getStatus: async (userId: number): Promise<ApiResponse> => {
    const url = `${API_BASE}/user-devices/user/${userId}/status`;
    logger.debug(`Calling getStatus devices API: ${url}`);
    
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
