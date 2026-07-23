import { API_BASE_URL } from '../config/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // Ensure base URL ends with slash
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;

    // Construct full URL
    const fullUrl = `${baseUrl}${cleanEndpoint}`;
    const url = new URL(fullUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    const url = this.buildURL(endpoint, params);
    console.log('API Request URL:', url);

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      console.log('API Response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: 'An error occurred'
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params,
      headers: options?.headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: options?.headers,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService(API_BASE_URL);

