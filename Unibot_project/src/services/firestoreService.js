import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  writeBatch,
  increment,
  deleteDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'

const userDoc   = (uid) => doc(db, 'users', uid)
const messagesCol = (uid) => collection(db, 'users', uid, 'messages')
const chatsCol  = () => collection(db, 'chats')
const chatDoc   = (chatId) => doc(db, 'chats', chatId)
const chatMessagesCol = (chatId) => collection(db, 'chats', chatId, 'messages')

const DEFAULT_NOTIF_PREFS = {
  chat:     true,
  academic: true,
  partner:  false,
}

function splitName(name = '') {
  const parts = name.trim().split(/\s+/)
  return {
    firstName: parts[0] || '',
    lastName:  parts.slice(1).join(' '),
  }
}

function mapProfileData(data = {}) {
  const name = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim()
  const { firstName, lastName } = splitName(name)
  return {
    name:        name || 'User',
    firstName:   data.firstName || firstName,
    lastName:    data.lastName  || lastName,
    email:       data.email     || '',
    role:        data.role      || 'user',
    avatar:      data.avatar    || null,
    phone:       data.phone     || '',
    studentId:   data.studentId || '',
    notifPrefs:  data.notifPrefs || DEFAULT_NOTIF_PREFS,
    questionCount: data.questionCount ?? 0,
  }
}

export const firestoreService = {
  async createUserProfile(uid, data) {
    const profile = {
      ...mapProfileData(data),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    await setDoc(userDoc(uid), profile)
    return profile
  },

  async ensureUserProfile(uid, data) {
    const snap = await getDoc(userDoc(uid))
    if (snap.exists()) return mapProfileData(snap.data())
    return this.createUserProfile(uid, data)
  },

  async getUserProfile(uid) {
    const snap = await getDoc(userDoc(uid))
    if (!snap.exists()) return mapProfileData({})
    return mapProfileData(snap.data())
  },

  async updateUserProfile(uid, updates) {
    const payload = { ...updates, updatedAt: serverTimestamp() }
    if (updates.name) {
      const { firstName, lastName } = splitName(updates.name)
      payload.firstName = firstName
      payload.lastName  = lastName
    }
    await updateDoc(userDoc(uid), payload)
    return this.getUserProfile(uid)
  },

  async saveNotificationPrefs(uid, notifPrefs) {
    await updateDoc(userDoc(uid), { notifPrefs, updatedAt: serverTimestamp() })
  },

  // ────── CHAT SESSIONS ──────────
  async createChat(uid, title = 'New Chat') {
    const chatId = doc(chatsCol()).id
    await setDoc(chatDoc(chatId), {
      id: chatId,
      userId: uid,
      title,
      messageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return chatId
  },

  async getChats(uid, max = 20) {
    const q = query(chatsCol(), 
      where('userId', '==', uid),
      orderBy('updatedAt', 'desc'), 
      limit(max)
    )
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id:          d.id,
        title:       data.title || 'Chat',
        messageCount: data.messageCount || 0,
        createdAt:   data.createdAt?.toDate?.() || new Date(),
        updatedAt:   data.updatedAt?.toDate?.() || new Date(),
      }
    })
  },

  async getChatMessages(chatId, max = 100) {
    const q = query(chatMessagesCol(chatId), orderBy('createdAt', 'asc'), limit(max))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id:    d.id,
        role:  data.role,
        text:  data.text,
        time:  data.time,
        cards: data.cards ?? null,
      }
    })
  },

  async addMessageToChat(chatId, message) {
    const messageRef = doc(chatMessagesCol(chatId))
    const batch = writeBatch(db)

    batch.set(messageRef, {
      role:      message.role,
      text:      message.text,
      time:      message.time,
      cards:     message.cards ?? null,
      createdAt: serverTimestamp(),
    })

    // Update chat metadata
    batch.update(chatDoc(chatId), {
      messageCount: increment(1),
      updatedAt: serverTimestamp(),
    })

    await batch.commit()
    return { id: messageRef.id, ...message }
  },

  async updateChatTitle(chatId, title) {
    await updateDoc(chatDoc(chatId), { title, updatedAt: serverTimestamp() })
  },

  async deleteChat(chatId) {
    // Delete all messages in the chat
    const messages = await getDocs(chatMessagesCol(chatId))
    const batch = writeBatch(db)
    messages.forEach((doc) => batch.delete(doc.ref))
    // Delete the chat document
    batch.delete(chatDoc(chatId))
    await batch.commit()
  },

  async addMessage(uid, message) {
    const messageRef = doc(messagesCol(uid))
    const batch = writeBatch(db)

    batch.set(messageRef, {
      role:      message.role,
      text:      message.text,
      time:      message.time,
      cards:     message.cards ?? null,
      createdAt: serverTimestamp(),
    })

    if (message.role === 'user') {
      batch.set(userDoc(uid), { questionCount: increment(1) }, { merge: true })
    }

    await batch.commit()
    return { id: messageRef.id, ...message }
  },

  async getMessages(uid, max = 50) {
    const q = query(messagesCol(uid), orderBy('createdAt', 'asc'), limit(max))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id:    d.id,
        role:  data.role,
        text:  data.text,
        time:  data.time,
        cards: data.cards ?? null,
      }
    })
  },
}
