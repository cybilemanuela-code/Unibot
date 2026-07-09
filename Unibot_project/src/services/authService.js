import api from '@/api/axios'

export const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload)
    return data
  },
  async login(payload) {
    const { data } = await api.post('/auth/login', payload)
    return data
  },
  async logout() {
    await api.post('/auth/logout')
  },
  async getProfile() {
    const { data } = await api.get('/auth/profile')
    return data
  },
  async updateProfile(payload) {
    const { data } = await api.put('/auth/profile', payload)
    return data
  },
}