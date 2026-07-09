import { ref, computed } from 'vue'

const GUEST_SESSION_KEY = 'unibot_guest_session'
const QUESTION_LIMIT = 3

const guestSession = ref(null)

function generateSessionId() {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function initGuestSession() {
  const stored = localStorage.getItem(GUEST_SESSION_KEY)
  
  if (stored) {
    try {
      guestSession.value = JSON.parse(stored)
    } catch {
      // Invalid stored data, create new session
      guestSession.value = createNewSession()
    }
  } else {
    guestSession.value = createNewSession()
  }
  
  saveSession()
  return guestSession.value
}

function createNewSession() {
  return {
    id: generateSessionId(),
    questionCount: 0,
    createdAt: new Date().toISOString(),
  }
}

function saveSession() {
  if (guestSession.value) {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestSession.value))
  }
}

function incrementQuestionCount() {
  if (!guestSession.value) {
    initGuestSession()
  }
  guestSession.value.questionCount += 1
  saveSession()
  return guestSession.value.questionCount
}

function getQuestionCount() {
  if (!guestSession.value) {
    initGuestSession()
  }
  return guestSession.value.questionCount
}

function isLimited() {
  return getQuestionCount() >= QUESTION_LIMIT
}

function getRemainingQuestions() {
  return Math.max(0, QUESTION_LIMIT - getQuestionCount())
}

function resetSession() {
  localStorage.removeItem(GUEST_SESSION_KEY)
  guestSession.value = null
}

export function useGuestSession() {
  return {
    guestSession: computed(() => guestSession.value),
    initGuestSession,
    incrementQuestionCount,
    getQuestionCount,
    isLimited,
    getRemainingQuestions,
    resetSession,
    QUESTION_LIMIT,
  }
}
