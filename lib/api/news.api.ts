import { API_BASE } from '../api-client';

export interface NewsItem {
  news_id: number;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  created_on: string;
}

export const newsApi = {
  getNews: async (): Promise<{ status: boolean; message: string; data: NewsItem[] }> => {
    try {
      const response = await fetch(`${API_BASE}/news`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return { status: false, message: 'Failed to fetch news', data: [] };
    }
  },

  getNewsById: async (id: number): Promise<{ status: boolean; message: string; data: NewsItem | null }> => {
    try {
      const response = await fetch(`${API_BASE}/news/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching news ${id}:`, error);
      return { status: false, message: 'Failed to fetch news item', data: null };
    }
  }
};
