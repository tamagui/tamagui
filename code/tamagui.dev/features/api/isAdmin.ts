/**
 * admin email whitelist for admin-only features like impersonation
 */
export const ADMIN_EMAILS = ['natewienert@gmail.com'] as const

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase())
}
