import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface SettingsForm {
  siteName: string;
  tagline: string;
  description: string;
  journalLink: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
}

export interface SettingsResponse {
  success: boolean;
  data: {
    general?: {
      site_name?: string;
      tagline?: string;
      description?: string;
      journal_link?: string;
    };
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
    };
    social?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      twitter?: string;
    };
  };
  raw?: Array<{
    id: number;
    key: string;
    value: string;
    group: string;
    label: string;
    type: string;
  }>;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const settingsService = {
  // Get all settings
  getAll: async (): Promise<SettingsResponse> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SETTINGS}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }

    return response.json();
  },

  // Save all settings
  save: async (form: SettingsForm): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SETTINGS_SAVE}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error('Failed to save settings');
    }

    return response.json();
  },

  // Transform API response to form data
  toFormData: (data: SettingsResponse['data']): SettingsForm => {
    return {
      siteName: data.general?.site_name || '',
      tagline: data.general?.tagline || '',
      description: data.general?.description || '',
      journalLink: data.general?.journal_link || 'https://ijissjournal.org/index.php/journal',
      email: data.contact?.email || '',
      phone: data.contact?.phone || '',
      address: data.contact?.address || '',
      facebook: data.social?.facebook || '',
      instagram: data.social?.instagram || '',
      youtube: data.social?.youtube || '',
      twitter: data.social?.twitter || '',
    };
  },
};

export default settingsService;
