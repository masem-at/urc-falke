/**
 * @vitest-environment happy-dom
 */
import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { GratisBadge } from './GratisBadge'

// ============================================================================
// GRATIS BADGE COMPONENT TESTS
// ============================================================================
// Tests for the USV member verification badge (Story 1.5, AC5)
//
// Requirements:
// - Green badge with checkmark icon
// - Text: "GRATIS für USV-Mitglieder"
// - Accessible (ARIA labels, min 44px touch target for large size)
// - Three sizes: sm, md, lg
// ============================================================================

// Clean up after each test to avoid multiple elements
afterEach(() => {
  cleanup()
})

describe('GratisBadge', () => {
  describe('rendering', () => {
    it('should render with default medium size', () => {
      render(<GratisBadge />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
      expect(badge.textContent).toContain('GRATIS für USV-Mitglieder')
    })

    it('should render with small size', () => {
      render(<GratisBadge size="sm" />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
      expect(badge.className).toContain('min-h-[32px]')
    })

    it('should render with large size for accessibility', () => {
      render(<GratisBadge size="lg" />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
      // Large size should have min 48px height for WCAG 2.1 AA touch target
      expect(badge.className).toContain('min-h-[48px]')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA label', () => {
      render(<GratisBadge />)

      const badge = screen.getByRole('status')
      expect(badge.getAttribute('aria-label')).toContain('GRATIS für USV-Mitglieder')
      expect(badge.getAttribute('aria-label')).toContain('verifiziert')
    })

    it('should have role="status" for screen readers', () => {
      render(<GratisBadge />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
    })
  })

  describe('styling', () => {
    it('should have green background color', () => {
      render(<GratisBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('bg-green-500')
    })

    it('should have white text color', () => {
      render(<GratisBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('text-white')
    })

    it('should have rounded corners', () => {
      render(<GratisBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('rounded-lg')
    })

    it('should apply custom className', () => {
      render(<GratisBadge className="custom-class" />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('custom-class')
    })
  })

  describe('content', () => {
    it('should display correct text', () => {
      render(<GratisBadge />)

      expect(screen.getByText('GRATIS für USV-Mitglieder')).toBeDefined()
    })

    it('should include checkmark icon', () => {
      render(<GratisBadge />)

      // Check for SVG element (Lucide Check icon)
      const badge = screen.getByRole('status')
      const svg = badge.querySelector('svg')
      expect(svg).not.toBeNull()
    })
  })
})
