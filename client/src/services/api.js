// Dynamic API base URL resolution supporting both local dev and production cloud deployments
const rawApiUrl = import.meta.env.VITE_API_URL;
let API_BASE = '/api';

if (rawApiUrl) {
  const cleaned = rawApiUrl.trim().replace(/\/+$/, '');
  API_BASE = cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
} else if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    API_BASE = 'http://localhost:5000/api';
  } else {
    API_BASE = `${window.location.origin}/api`;
  }
}

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('cognitrace_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token && token !== 'null' && token !== 'undefined') {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${cleanEndpoint}`, {
      ...options,
      headers,
    });
  } catch (networkErr) {
    throw new Error('Network error. Unable to connect to the backend server.');
  }

  let data = {};
  try {
    data = await response.json();
  } catch (jsonErr) {
    if (!response.ok) {
      throw new Error(`Server request failed with status code ${response.status}`);
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('cognitrace_token');
    }
    throw new Error(data.message || data.error || 'An API error occurred');
  }

  return data;
}

export default {
  // Auth
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => fetchApi('/auth/me'),

  // Courses
  getCourses: (params = '') => fetchApi(`/courses${params ? '?' + params : ''}`),
  getCourseBySlug: (slug) => fetchApi(`/courses/${slug}`),
  getMyCourses: () => fetchApi('/courses/my-courses'),
  enrollCourse: (courseId) => fetchApi('/courses/enroll', { method: 'POST', body: JSON.stringify({ courseId }) }),
  updateProgress: (courseId, lessonId) => fetchApi('/courses/progress', { method: 'POST', body: JSON.stringify({ courseId, lessonId }) }),
  createCourse: (courseData) => fetchApi('/courses', { method: 'POST', body: JSON.stringify(courseData) }),

  // Concepts & Profile
  getConceptGraph: () => fetchApi('/concepts/graph'),
  getConceptBySlug: (slug) => fetchApi(`/concepts/${slug}`),
  getStudentProfile: () => fetchApi('/profile/me'),

  // Quizzes & Evidence
  getQuizzes: (params = '') => fetchApi(`/quizzes${params ? '?' + params : ''}`),
  getQuizById: (id) => fetchApi(`/quizzes/${id}`),
  submitQuiz: (data) => fetchApi('/quizzes/submit', { method: 'POST', body: JSON.stringify(data) }),
  submitDiagnostic: (data) => fetchApi('/quizzes/diagnostic', { method: 'POST', body: JSON.stringify(data) }),

  // Programming Challenges & Multi-Language Compiler
  getChallenges: () => fetchApi('/challenges'),
  getChallengeById: (id) => fetchApi(`/challenges/${id}`),
  submitChallenge: (id, payload) => fetchApi(`/challenges/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  executeCompiler: (payload) => fetchApi('/compiler/execute', { method: 'POST', body: JSON.stringify(payload) }),

  // Recommendations
  getRecommendations: () => fetchApi('/recommendations'),

  // Doubts
  getDoubts: (params = '') => fetchApi(`/doubts${params ? '?' + params : ''}`),
  createDoubt: (data) => fetchApi('/doubts', { method: 'POST', body: JSON.stringify(data) }),
  replyDoubt: (id, message) => fetchApi(`/doubts/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) }),
  resolveDoubt: (id) => fetchApi(`/doubts/${id}/resolve`, { method: 'PATCH' }),

  // Blogs & Webinars
  getBlogs: (params = '') => fetchApi(`/blogs${params ? '?' + params : ''}`),
  getBlogBySlug: (slug) => fetchApi(`/blogs/${slug}`),
  createBlog: (data) => fetchApi('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  deleteBlog: (id) => fetchApi(`/blogs/${id}`, { method: 'DELETE' }),

  getWebinars: () => fetchApi('/webinars'),
  createWebinar: (data) => fetchApi('/webinars', { method: 'POST', body: JSON.stringify(data) }),
  registerWebinar: (id) => fetchApi(`/webinars/${id}/register`, { method: 'POST' }),

  // Questions
  getQuestions: (params = '') => fetchApi(`/questions${params ? '?' + params : ''}`),
  createQuestion: (data) => fetchApi('/questions', { method: 'POST', body: JSON.stringify(data) }),
  deleteQuestion: (id) => fetchApi(`/questions/${id}`, { method: 'DELETE' }),

  // Teacher Analytics
  getTeacherAnalytics: () => fetchApi('/teacher/analytics'),
  getIllusionMatrix: () => fetchApi('/teacher/cohort/illusion-matrix'),
  resetDemo: () => fetchApi('/teacher/reset-demo', { method: 'POST' }),

  // Admin Stats & User Management
  getAdminStats: () => fetchApi('/admin/stats'),
  updateUserRole: (userId, role) => fetchApi(`/admin/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deleteUser: (userId) => fetchApi(`/admin/users/${userId}`, { method: 'DELETE' }),
};
