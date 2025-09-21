import axiosInstance from './axios';

// Types
export interface Newsletter {
  id: string;
  title: string;
  sub_title?: string;
  headline_image_url?: string;
  html_content?: string;
  footer_content?: string;
  created_at: string;
}

export interface Webinar {
  id: string;
  title: string;
  video_url?: string;
  created_at: string;
}

export interface Podcast {
  id: string;
  title: string;
  html_content?: string;
  video_url?: string;
  created_at: string;
}

// Newsletter API
export const newsletterApi = {
  // Public APIs
  getAll: (): Promise<Newsletter[]> => 
    axiosInstance.get('/content/newsletters').then(res => res.data),
  
  getById: (id: string): Promise<Newsletter> => 
    axiosInstance.get(`/content/newsletters/${id}`).then(res => res.data),

  // Admin APIs
  create: (data: Omit<Newsletter, 'id' | 'created_at'>): Promise<Newsletter> => 
    axiosInstance.post('/admin/content/newsletters', data).then(res => res.data),
  
  update: (id: string, data: Partial<Omit<Newsletter, 'id' | 'created_at'>>): Promise<Newsletter> => 
    axiosInstance.put(`/admin/content/newsletters/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<{ message: string }> => 
    axiosInstance.delete(`/admin/content/newsletters/${id}`).then(res => res.data),
};

// Webinar API
export const webinarApi = {
  // Public APIs
  getAll: (): Promise<Webinar[]> => 
    axiosInstance.get('/content/webinars').then(res => res.data),
  
  getById: (id: string): Promise<Webinar> => 
    axiosInstance.get(`/content/webinars/${id}`).then(res => res.data),

  // Admin APIs
  create: (data: Omit<Webinar, 'id' | 'created_at'>): Promise<Webinar> => 
    axiosInstance.post('/admin/content/webinars', data).then(res => res.data),
  
  update: (id: string, data: Partial<Omit<Webinar, 'id' | 'created_at'>>): Promise<Webinar> => 
    axiosInstance.put(`/admin/content/webinars/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<{ message: string }> => 
    axiosInstance.delete(`/admin/content/webinars/${id}`).then(res => res.data),
};

// Podcast API
export const podcastApi = {
  // Public APIs
  getAll: (): Promise<Podcast[]> => 
    axiosInstance.get('/content/podcasts').then(res => res.data),
  
  getById: (id: string): Promise<Podcast> => 
    axiosInstance.get(`/content/podcasts/${id}`).then(res => res.data),

  // Admin APIs
  create: (data: Omit<Podcast, 'id' | 'created_at'>): Promise<Podcast> => 
    axiosInstance.post('/admin/content/podcasts', data).then(res => res.data),
  
  update: (id: string, data: Partial<Omit<Podcast, 'id' | 'created_at'>>): Promise<Podcast> => 
    axiosInstance.put(`/admin/content/podcasts/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<{ message: string }> => 
    axiosInstance.delete(`/admin/content/podcasts/${id}`).then(res => res.data),
};
