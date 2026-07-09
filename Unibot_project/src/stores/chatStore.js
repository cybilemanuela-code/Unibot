import { defineStore } from 'pinia'
import { ref } from 'vue'
import { firestoreService } from '@/services/firestoreService'

const WELCOME_MESSAGE = (name, lang) => ({
  role: 'bot',
  text: lang === 'fr'
    ? `Bonjour ${name || 'Guest'} ! Je suis ravi de vous revoir. Comment puis-je vous aider aujourd'hui ?`
    : `Hello ${name || 'Guest'}! I'm delighted to see you again. How can I assist you with your university journey today?`,
  time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  cards: null,
})

export const useChatStore = defineStore('chat', () => {
  const messages  = ref([])
  const isTyping  = ref(false)
  const isLoading = ref(false)
  const showGuestLimitOverlay = ref(false)
  const currentChatId = ref(null)
  const chatList = ref([])
  const showViewMore = ref(false)

  function setMessages(list) { messages.value = list }

  function addMessage(msg) { messages.value.push(msg) }

  function setTyping(val) { isTyping.value = val }
  function setLoading(val) { isLoading.value = val }
  function setShowGuestLimitOverlay(val) { showGuestLimitOverlay.value = val }

  function clearMessages() { messages.value = [] }

  function getWelcomeMessage(name, lang) {
    return { id: 'welcome', ...WELCOME_MESSAGE(name, lang) }
  }

  function setCurrentChatId(id) { currentChatId.value = id }

  function setChatList(list) { chatList.value = list }

  function setShowViewMore(val) { showViewMore.value = val }

  async function loadChats(uid) {
    if (!uid) return
    try {
      const chats = await firestoreService.getChats(uid, 50)
      chatList.value = chats
    } catch (e) {
      console.error('loadChats failed:', e)
      chatList.value = []
    }
  }

  async function loadMessages(chatId) {
    if (!chatId) return
    const msgs = await firestoreService.getChatMessages(chatId)
    setMessages(msgs)
  }

  function resetToWelcome(name, lang) {
    setMessages([{ id: 'welcome', ...WELCOME_MESSAGE(name, lang) }])
  }

  return {
    messages, isTyping, isLoading, showGuestLimitOverlay,
    currentChatId, chatList, showViewMore,
    setMessages, addMessage, setTyping, setLoading,
    setShowGuestLimitOverlay, clearMessages, getWelcomeMessage,
    setCurrentChatId, setChatList, loadChats, loadMessages,
    setShowViewMore, resetToWelcome,
  }
})
