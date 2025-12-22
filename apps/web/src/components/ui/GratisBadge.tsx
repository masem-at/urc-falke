import { Check } from 'lucide-react';

interface GratisBadgeProps {
  /**
   * Size variant for the badge
   * @default 'default'
   */
  size?: 'default' | 'large';

  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * GRATIS Badge Component for verified USV members
 *
 * Design Requirements:
 * - Green background (#22C55E - Tailwind green-500)
 * - White text and checkmark icon
 * - Min 44x44px height for accessibility (WCAG 2.1 AA)
 * - Prominent display on profile and event pages
 * - Keyboard focusable with ARIA label
 *
 * @example
 * ```tsx
 * <GratisBadge />
 * <GratisBadge size="large" />
 * ```
 */
export function GratisBadge({ size = 'default', className = '' }: GratisBadgeProps) {
  const sizeClasses = {
    default: 'text-sm py-2 px-4', // ~40px height
    large: 'text-base py-3 px-4', // ~48px height (meets 44px minimum)
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2
        bg-green-500 text-white
        rounded-lg font-semibold
        ${sizeClasses[size]}
        ${className}
      `}
      role="status"
      aria-label="USV-Mitgliedschaft verifiziert - GRATIS für USV-Mitglieder"
    >
      <Check className="w-5 h-5" aria-hidden="true" />
      <span>GRATIS für USV-Mitglieder</span>
    </div>
  );
}
