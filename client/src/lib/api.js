export class ApiClient {
  constructor() {
    this.baseURL = '/api';
    this.csrfToken = null;
  }

  async getCsrfToken() {
    if (!this.csrfToken) {
      const response = await fetch(`${this.baseURL}/csrf-token`, {
        credentials: 'include'
      });
      const data = await response.json();
      this.csrfToken = data.csrfToken;
    }
    return this.csrfToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Add CSRF token for non-GET requests
    if (options.method && options.method !== 'GET') {
      const csrfToken = await this.getCsrfToken();
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add auth token if available
    const authToken = localStorage.getItem('accessToken');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, config);

    // Handle 401 - try to refresh token
    if (response.status === 401 && authToken) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the original request
        const newAuthToken = localStorage.getItem('accessToken');
        config.headers['Authorization'] = `Bearer ${newAuthToken}`;
        return await fetch(url, config);
      } else {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response;
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async get(endpoint) {
    const response = await this.request(endpoint);
    return response.json();
  }

  async post(endpoint, data) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async patch(endpoint, data) {
    const response = await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();
