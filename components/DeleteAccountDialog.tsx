'use client'

import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useState } from 'react'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

/**
 * DeleteAccountDialog - Confirmation dialog for account deletion (DSGVO compliance)
 *
 * Features:
 * - Uses Radix AlertDialog for proper focus management and accessibility
 * - role="alertdialog" for screen readers
 * - Escape key closes dialog (cancel action)
 * - All buttons are keyboard accessible with proper focus states
 * - 44x44px minimum touch targets (WCAG)
 * - German language UI
 *
 * @param open - Controls dialog visibility
 * @param onOpenChange - Called when dialog open state changes
 * @param onConfirm - Async function called when user confirms deletion
 */
export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm
}: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset error state when dialog opens/closes (MEDIUM-3 fix)
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setError(null)
      setIsDeleting(false)
    }
    onOpenChange(newOpen)
  }

  const handleConfirm = async (event: React.MouseEvent) => {
    // HIGH-2 fix: Prevent AlertDialog.Action from closing immediately
    event.preventDefault()

    setIsDeleting(true)
    setError(null)
    try {
      await onConfirm()
      // Dialog will be closed by parent after successful deletion
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten'
      setError(message)
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 max-w-md w-[calc(100%-2rem)] shadow-xl z-50 focus:outline-none"
          aria-describedby="delete-account-description"
        >
          <AlertDialog.Title className="text-xl font-bold text-gray-900 mb-4">
            Möchtest du deinen Account wirklich löschen?
          </AlertDialog.Title>

          <AlertDialog.Description
            id="delete-account-description"
            className="text-gray-600 mb-6 space-y-3"
          >
            <p className="font-medium text-red-700">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <p>
              Alle deine Daten (Profil, Event-Anmeldungen, Fotos, Kommentare) werden dauerhaft gelöscht.
            </p>
          </AlertDialog.Description>

          {error && (
            <div
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex gap-4 justify-end flex-wrap">
            <AlertDialog.Cancel asChild>
              <button
                className="min-h-[44px] min-w-[44px] px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                disabled={isDeleting}
              >
                Abbrechen
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="min-h-[44px] min-w-[44px] px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Wird gelöscht...' : 'Ja, Account löschen'}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
