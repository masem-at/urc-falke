'use client'

import React from 'react'
import { Check } from 'lucide-react'

export interface GratisBadgeProps {
  /** Size variant of the badge */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
}

/**
 * GRATIS Badge for verified USV members
 *
 * Displays a green badge with checkmark icon indicating the user
 * is a verified USV member and gets free access.
 *
 * @example
 * <GratisBadge size="lg" />
 *
 * Design specs (from Story 1.5):
 * - Background: Green (#22C55E)
 * - Text: White (#FFFFFF)
 * - Icon: White checkmark
 * - Border radius: 8px
 * - Min height: 44px for accessibility (large size)
 */
export function GratisBadge({ size = 'md', className = '' }: GratisBadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs min-h-[32px]',
    md: 'px-3 py-1.5 text-sm min-h-[36px]',
    lg: 'px-4 py-2 text-base min-h-[48px]', // 48px for WCAG 2.1 AA touch target
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  return (
    <div
      role="status"
      aria-label="GRATIS für USV-Mitglieder - Deine Mitgliedschaft wurde verifiziert"
      className={`
        inline-flex items-center gap-2
        bg-green-500 text-white
        rounded-lg font-medium
        ${sizeStyles[size]}
        ${className}
      `}
    >
      <Check
        size={iconSizes[size]}
        className="flex-shrink-0"
        aria-hidden="true"
      />
      <span>GRATIS für USV-Mitglieder</span>
    </div>
  )
}

export default GratisBadge
