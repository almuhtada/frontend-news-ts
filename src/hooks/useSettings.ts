import { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
}

// Default kosong - semua data dari database
const defaultSettings: SiteSettings = {
  siteName: '',
  tagline: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  facebook: '',
  instagram: '',
  youtube: '',
  twitter: '',
};

// Cache settings to avoid repeated API calls
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || defaultSettings);
  const [loading, setLoading] = useState(!cachedSettings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      // Use cache if still valid
      const now = Date.now();
      if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
        setSettings(cachedSettings);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SETTINGS}`);

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();

        if (data.success && data.data) {
          const newSettings: SiteSettings = {
            siteName: data.data.general?.site_name || defaultSettings.siteName,
            tagline: data.data.general?.tagline || defaultSettings.tagline,
            description: data.data.general?.description || defaultSettings.description,
            email: data.data.contact?.email || defaultSettings.email,
            phone: data.data.contact?.phone || defaultSettings.phone,
            address: data.data.contact?.address || defaultSettings.address,
            facebook: data.data.social?.facebook || defaultSettings.facebook,
            instagram: data.data.social?.instagram || defaultSettings.instagram,
            youtube: data.data.social?.youtube || defaultSettings.youtube,
            twitter: data.data.social?.twitter || defaultSettings.twitter,
          };

          // Update cache
          cachedSettings = newSettings;
          cacheTimestamp = now;

          setSettings(newSettings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
        // Use default settings on error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

// Function to clear cache (useful after saving new settings)
export const clearSettingsCache = () => {
  cachedSettings = null;
  cacheTimestamp = 0;
};

export default useSettings;
