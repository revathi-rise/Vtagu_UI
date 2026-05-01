import { API_BASE } from '../api-client';

export interface UpdateProfilePayload {
  user_name?: string;
  age?: number;
  gender?: string;
  profile_picture?: string;
  mobile?: string;
  dob?: string;
}

export const userApi = {
  updateProfile: async (userId: number, data: UpdateProfilePayload, token: string) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      return { status: false, message: 'Failed to update profile' };
    }
  }
};
