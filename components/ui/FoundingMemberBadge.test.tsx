/**
 * @vitest-environment happy-dom
 */
import React from 'react'
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { FoundingMemberBadge } from './FoundingMemberBadge'

// ============================================================================
// FOUNDING MEMBER BADGE COMPONENT TESTS
// ============================================================================
// Tests for the Founding Member badge (Story 1.6, AC1)
//
// Requirements:
// - Gold/Amber badge with star icon
// - Text: "Gründungsmitglied"
// - Tooltip: "Du gehörst zu den ersten Mitgliedern! Danke für deine Unterstützung."
// - Accessible (ARIA labels, min 44px touch target for large size)
// - Three sizes: sm, md, lg
// ============================================================================

// Clean up after each test to avoid multiple elements
afterEach(() => {
  cleanup()
})

describe('FoundingMemberBadge', () => {
  describe('rendering', () => {
    it('should render with default medium size', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
      expect(badge.textContent).toContain('Gründungsmitglied')
    })

    it('should render with small size', () => {
      render(<FoundingMemberBadge size="sm" />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
      expect(badge.className).toContain('min-h-[32px]')
    })

    it('should render with large size for accessibility', () => {
      render(<FoundingMemberBadge size="lg" />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
      // Large size should have min 48px height for WCAG 2.1 AA touch target
      expect(badge.className).toContain('min-h-[48px]')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA label', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge.getAttribute('aria-label')).toContain('Gründungsmitglied')
      expect(badge.getAttribute('aria-label')).toContain('ersten Mitgliedern')
    })

    it('should have role="status" for screen readers', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge).toBeDefined()
    })

    it('should have tooltip with thank you message', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge.getAttribute('title')).toContain('Du gehörst zu den ersten Mitgliedern')
      expect(badge.getAttribute('title')).toContain('Danke für deine Unterstützung')
    })
  })

  describe('styling', () => {
    it('should have amber/gold background color', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('bg-amber-500')
    })

    it('should have white text color', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('text-white')
    })

    it('should have rounded corners', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('rounded-lg')
    })

    it('should apply custom className', () => {
      render(<FoundingMemberBadge className="custom-class" />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('custom-class')
    })

    it('should have cursor-help for tooltip indication', () => {
      render(<FoundingMemberBadge />)

      const badge = screen.getByRole('status')
      expect(badge.className).toContain('cursor-help')
    })
  })

  describe('content', () => {
    it('should display correct text', () => {
      render(<FoundingMemberBadge />)

      expect(screen.getByText('Gründungsmitglied')).toBeDefined()
    })

    it('should include star icon', () => {
      render(<FoundingMemberBadge />)

      // Check for SVG element (Lucide Star icon)
      const badge = screen.getByRole('status')
      const svg = badge.querySelector('svg')
      expect(svg).not.toBeNull()
    })
  })
})
