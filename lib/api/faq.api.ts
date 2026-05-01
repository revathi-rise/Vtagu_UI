import { API_BASE } from '../api-client';

export interface FAQItem {
  faq_id: number;
  question: string;
  answer: string;
  category?: string;
  created_on: string;
}

export const faqApi = {
  getFaqs: async (): Promise<{ status: boolean; message: string; data: FAQItem[] }> => {
    try {
      const response = await fetch(`${API_BASE}/faqs`, {
        next: { revalidate: 86400 } // Cache for 24 hours
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return { status: false, message: 'Failed to fetch FAQs', data: [] };
    }
  }
};
