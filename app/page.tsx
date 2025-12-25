'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

export const dynamic = 'force-dynamic'

function HomePageContent() {
  const searchParams = useSearchParams()
  const [toast, setToast] = useState<string | null>(null)

  // Check for account deletion success message
  useEffect(() => {
    if (searchParams.get('deleted') === 'true') {
      setToast('Dein Account wurde erfolgreich gelöscht. Wir hoffen, dich bald wieder zu sehen!')

      // Clear the query parameter from URL without reload
      window.history.replaceState({}, '', '/')

      // Auto-hide toast after 7 seconds
      const timeout = setTimeout(() => setToast(null), 7000)
      return () => clearTimeout(timeout)
    }
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        {/* Success Toast for Account Deletion */}
        {toast && (
          <div
            className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center"
            role="alert"
            aria-live="polite"
          >
            {toast}
          </div>
        )}

        <h1 className="text-4xl font-bold mb-8 text-center">
          URC Falke
        </h1>

        <p className="text-center mb-8">
          Willkommen zur Mitgliederverwaltung
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Anmelden
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Registrieren
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">
            URC Falke
          </h1>
          <p className="text-center mb-8">Lädt...</p>
        </div>
      </main>
    }>
      <HomePageContent />
    </Suspense>
  )
}
