// API Service Module for CogniTrace LMS

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://learning-management-system-brfl.onrender.com';
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'An error occurred during request');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  async login(credentials) {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(userData) {
    const data = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    return request('/api/auth/me');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
};

export const conceptApi = {
  async getGraph() {
    return request('/api/concepts/graph');
  },
  async getBySlug(slug) {
    return request(`/api/concepts/${slug}`);
  },
};

export const challengeApi = {
  async getChallenges(conceptSlug) {
    const url = conceptSlug ? `/api/challenges?conceptSlug=${conceptSlug}` : '/api/challenges';
    return request(url);
  },
  async submit(id, payload) {
    return request(`/api/challenges/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const vivaApi = {
  async initiate(submissionId) {
    return request('/api/viva/initiate', {
      method: 'POST',
      body: JSON.stringify({ submissionId }),
    });
  },
  async answer(sessionId, questionIndex, answer) {
    return request(`/api/viva/${sessionId}/answer`, {
      method: 'PATCH',
      body: JSON.stringify({ questionIndex, answer }),
    });
  },
  async finalize(sessionId) {
    return request(`/api/viva/${sessionId}/finalize`, {
      method: 'POST',
    });
  },
};

export const profileApi = {
  async getMe() {
    return request('/api/profile/me');
  },
};

export const teacherApi = {
  async getIllusionMatrix() {
    return request('/api/teacher/cohort/illusion-matrix');
  },
  async resetDemo() {
    return request('/api/teacher/reset-demo', { method: 'POST' });
  },
};
