'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OnboardExistingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Kein Onboarding-Token gefunden. Bitte nutze den Link aus deiner Einladung.')
      setLoading(false)
      return
    }

    // Validate token and get JWT
    const validateToken = async () => {
      try {
        const response = await fetch('/api/v1/auth/onboard-existing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.detail || 'Token ungültig oder abgelaufen')
          setLoading(false)
          return
        }

        // Redirect to next step (set-password or dashboard)
        router.push(data.redirectTo || '/onboard-existing/set-password')
      } catch (err) {
        setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.')
        setLoading(false)
      }
    }

    validateToken()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">URC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Willkommen beim URC Falke
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {loading ? 'Dein Konto wird vorbereitet...' : 'Mitglieder-Onboarding'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Token wird validiert...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Zum Login
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
