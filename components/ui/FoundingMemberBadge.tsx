'use client'

import React from 'react'
import { Star } from 'lucide-react'

export interface FoundingMemberBadgeProps {
  /** Size variant of the badge */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
}

/**
 * Founding Member Badge for early supporters
 *
 * Displays a gold badge with star icon indicating the user
 * is a founding member who joined before the official launch.
 *
 * @example
 * <FoundingMemberBadge size="lg" />
 *
 * Design specs (from Story 1.6):
 * - Background: Amber-500 (#F59E0B)
 * - Text: White (#FFFFFF)
 * - Icon: White star
 * - Border radius: 8px
 * - Min height: 44px for accessibility (large size)
 * - Tooltip: "Du gehörst zu den ersten Mitgliedern! Danke für deine Unterstützung."
 */
export function FoundingMemberBadge({ size = 'md', className = '' }: FoundingMemberBadgeProps) {
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
      aria-label="Gründungsmitglied - Du gehörst zu den ersten Mitgliedern"
      title="Du gehörst zu den ersten Mitgliedern! Danke für deine Unterstützung."
      className={`
        inline-flex items-center gap-2
        bg-amber-500 text-white
        rounded-lg font-medium
        cursor-help
        ${sizeStyles[size]}
        ${className}
      `}
    >
      <Star
        size={iconSizes[size]}
        className="flex-shrink-0"
        aria-hidden="true"
        fill="currentColor"
      />
      <span>Gründungsmitglied</span>
    </div>
  )
}

export default FoundingMemberBadge
