const AUTH_MESSAGES = {
  'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
  'auth/invalid-email':        'Please enter a valid email address.',
  'auth/user-disabled':        'This account has been disabled.',
  'auth/user-not-found':       'No account found with this email.',
  'auth/wrong-password':       'Incorrect password. Please try again.',
  'auth/invalid-credential':   'Invalid email or password.',
  'auth/weak-password':        'Password must be at least 6 characters.',
  'auth/too-many-requests':    'Too many attempts. Please wait and try again.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
}

export function getFirebaseErrorMessage(err) {
  if (!err?.code) return null
  return AUTH_MESSAGES[err.code] || err.message || null
}
