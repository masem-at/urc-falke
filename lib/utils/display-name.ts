/**
 * Display Name Utility
 *
 * Handles user name display logic throughout the app:
 * - If user has nickname: "Nickname (FirstName LastName)"
 * - If no nickname: "FirstName LastName"
 *
 * Used in:
 * - Event participant lists
 * - User profiles
 * - Admin dashboard
 * - Notifications
 * - Welcome messages
 */

export interface UserDisplayName {
  nickname?: string | null;
  firstName?: string | null;
  first_name?: string | null; // Support both camelCase and snake_case
  lastName?: string | null;
  last_name?: string | null;
}

/**
 * Get display name for a user
 *
 * @param user - User object with nickname, firstName, and lastName
 * @returns Formatted display name
 *
 * @example
 * // With nickname
 * getDisplayName({ nickname: 'Fritz', firstName: 'Friedrich', lastName: 'Semper' })
 * // Returns: "Fritz (Friedrich Semper)"
 *
 * @example
 * // Without nickname
 * getDisplayName({ firstName: 'Friedrich', lastName: 'Semper' })
 * // Returns: "Friedrich Semper"
 *
 * @example
 * // Only nickname
 * getDisplayName({ nickname: 'Fritz' })
 * // Returns: "Fritz"
 *
 * @example
 * // Only first name
 * getDisplayName({ firstName: 'Friedrich' })
 * // Returns: "Friedrich"
 */
export function getDisplayName(user: UserDisplayName): string {
  // Normalize field names (support both camelCase and snake_case)
  const nickname = user.nickname?.trim()
  const firstName = (user.firstName || user.first_name)?.trim()
  const lastName = (user.lastName || user.last_name)?.trim()

  // Build full name from firstName and lastName
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  // If nickname exists, show: "Nickname (FirstName LastName)"
  if (nickname) {
    if (fullName) {
      return `${nickname} (${fullName})`
    }
    // Only nickname, no full name
    return nickname
  }

  // No nickname, show full name or fallback
  return fullName || 'Unbekannt'
}

/**
 * Get short display name (nickname only, or first name, or "Unbekannt")
 *
 * @param user - User object with nickname and firstName
 * @returns Short display name
 *
 * @example
 * getShortDisplayName({ nickname: 'Fritz', firstName: 'Friedrich' })
 * // Returns: "Fritz"
 *
 * @example
 * getShortDisplayName({ firstName: 'Friedrich' })
 * // Returns: "Friedrich"
 */
export function getShortDisplayName(user: UserDisplayName): string {
  const nickname = user.nickname?.trim()
  const firstName = (user.firstName || user.first_name)?.trim()

  return nickname || firstName || 'Unbekannt'
}
