const ADMIN_ROLES = new Set(['admin', 'superadmin'])

export function normalizeRole(role) {
  return String(role || 'user').trim().toLowerCase()
}

export function isAdminRole(role) {
  return ADMIN_ROLES.has(normalizeRole(role))
}

export function getAdminAppUrl() {
  return import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:5174/admin/overview'
}

export function redirectByRole(role, router, userHome = '/app/chat') {
  if (isAdminRole(role)) {
    window.location.href = getAdminAppUrl()
    return
  }
  router.push(userHome)
}
