import api from '@/api/axios'

export const chatService = {
  async sendMessage(message) {
    const { data } = await api.post('/chat', { message })
    return data
  },
  async sendGuestMessage(message) {
    const { data } = await api.post('/chat/guest', { message })
    return data
  },
  async getHistory(limit = 20) {
    const { data } = await api.get(`/chat/history?limit=${limit}`)
    return data
  },
}