import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const bookService = {
  getAllBooks: async (status) => {
    const url = status ? `/books?status=${status}` : '/books';
    const response = await api.get(url);
    return response.data;
  },

  getBook: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  proposeBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  voteBook: async (id, voteType) => {
    const response = await api.post(`/books/${id}/vote`, { voteType });
    return response.data;
  },

  removeVote: async (id) => {
    const response = await api.delete(`/books/${id}/vote`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/books/${id}/status`, { status });
    return response.data;
  }
};

export const progressService = {
  getMyProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  getProgressForBook: async (bookId) => {
    const response = await api.get(`/progress/${bookId}`);
    return response.data;
  },

  updateProgress: async (bookId, progressData) => {
    const response = await api.post(`/progress/${bookId}`, progressData);
    return response.data;
  },

  getAllProgressForBook: async (bookId) => {
    const response = await api.get(`/progress/book/${bookId}/all`);
    return response.data;
  }
};

export const discussionService = {
  getDiscussionsForBook: async (bookId) => {
    const response = await api.get(`/discussions/book/${bookId}`);
    return response.data;
  },

  getDiscussion: async (id) => {
    const response = await api.get(`/discussions/${id}`);
    return response.data;
  },

  createDiscussion: async (discussionData) => {
    const response = await api.post('/discussions', discussionData);
    return response.data;
  },

  addReply: async (id, content) => {
    const response = await api.post(`/discussions/${id}/reply`, { content });
    return response.data;
  },

  deleteDiscussion: async (id) => {
    const response = await api.delete(`/discussions/${id}`);
    return response.data;
  }
};
