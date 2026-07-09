import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '@/firebase'
import { firestoreService } from '@/services/firestoreService'

const googleProvider = new GoogleAuthProvider()

function mapAuthUser(fbUser, profile = {}) {
  const name = profile.name || fbUser.displayName || ''
  const [firstName = '', ...rest] = name.split(' ')
  return {
    uid:       fbUser.uid,
    name,
    firstName: profile.firstName || firstName,
    lastName:  profile.lastName  || rest.join(' '),
    email:     profile.email || fbUser.email || '',
    role:      profile.role || 'user',
    avatar:    profile.avatar || fbUser.photoURL || null,
    phone:     profile.phone || '',
    studentId: profile.studentId || '',
    isGuest:   fbUser.isAnonymous || false,
  }
}

export const firebaseAuthService = {
  async register({ name, email, password, role = 'user' }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })

    const profile = await firestoreService.createUserProfile(cred.user.uid, {
      name,
      email,
      role,
      avatar: cred.user.photoURL || null,
    })

    const token = await cred.user.getIdToken()
    return { user: mapAuthUser(cred.user, profile), token }
  },

  async login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const profile = await firestoreService.getUserProfile(cred.user.uid)
    const token = await cred.user.getIdToken()
    return { user: mapAuthUser(cred.user, profile), token }
  },

  async loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    const profile = await firestoreService.ensureUserProfile(cred.user.uid, {
      name:   cred.user.displayName || '',
      email:  cred.user.email || '',
      role:   'student',
      avatar: cred.user.photoURL || null,
    })
    const token = await cred.user.getIdToken()
    return { user: mapAuthUser(cred.user, profile), token }
  },

  async loginAsGuest() {
    const cred = await signInAnonymously(auth)
    const profile = await firestoreService.ensureUserProfile(cred.user.uid, {
      name:  'Guest',
      email: '',
      role:  'guest',
    })
    const token = await cred.user.getIdToken()
    return { user: mapAuthUser(cred.user, profile), token }
  },

  async logout() {
    await signOut(auth)
  },

  async changePassword(currentPassword, newPassword) {
    const user = auth.currentUser
    if (!user?.email) throw new Error('No signed-in user found.')
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword)
  },

  async updateDisplayName(name) {
    const user = auth.currentUser
    if (!user) throw new Error('No signed-in user found.')
    await updateProfile(user, { displayName: name })
  },

  mapAuthUser,
}
