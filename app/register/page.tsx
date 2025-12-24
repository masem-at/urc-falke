'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GratisBadge } from '@/components/ui/GratisBadge'
import { triggerConfetti } from '@/lib/confetti'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [hasUsvNumber, setHasUsvNumber] = useState(false)
  const [usvNumber, setUsvNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPasswordMismatch(false)

    // Client-side password validation
    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      setError('Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        email,
        password,
      }

      // Add optional fields only if they have values
      if (firstName.trim()) payload.firstName = firstName
      if (lastName.trim()) payload.lastName = lastName
      if (nickname.trim()) payload.nickname = nickname
      if (hasUsvNumber && usvNumber.trim()) payload.usvNumber = usvNumber

      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle duplicate email error with "Passwort vergessen?" link
        if (response.status === 409 && data.type?.includes('email-exists')) {
          setError(
            <span>
              {data.detail || 'Diese Email-Adresse ist bereits registriert.'}{' '}
              <a href="/reset-password" className="underline font-semibold">
                Passwort vergessen?
              </a>
            </span> as any
          )
        } else {
          setError(data.detail || 'Registrierung fehlgeschlagen')
        }
        setLoading(false)
        return
      }

      // Success! Trigger konfetti animation
      triggerConfetti()

      // Show USV verification message if USV number was provided
      if (hasUsvNumber && usvNumber) {
        // Brief delay to show konfetti, then show message
        setTimeout(() => {
          alert('Geschafft! Du bist jetzt Mitglied.\n\nDeine USV-Mitgliedsnummer wird geprüft...')
        }, 500)
      }

      // Redirect to events page (not dashboard!)
      setTimeout(() => {
        router.push('/events')
      }, 1000)
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">URC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Willkommen in der Falken-Familie!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Erstelle dein URC Falke Konto in unter 30 Sekunden
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Mindestens 8 Zeichen, mit Groß- und Kleinbuchstaben und einer Zahl
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Passwort bestätigen *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (passwordMismatch) setPasswordMismatch(false)
                }}
                className={`mt-1 block w-full rounded-md border ${
                  passwordMismatch ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {passwordMismatch && (
                <p className="mt-1 text-xs text-red-600">Passwörter stimmen nicht überein</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Vorname (optional)
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nachname (optional)
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                Spitzname (optional)
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                maxLength={50}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Wird in der App angezeigt</p>
            </div>

            {/* USV Checkbox */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="hasUsvNumber"
                  name="hasUsvNumber"
                  type="checkbox"
                  checked={hasUsvNumber}
                  onChange={(e) => setHasUsvNumber(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <label htmlFor="hasUsvNumber" className="ml-3 block text-sm font-medium text-gray-700">
                  Hast du eine USV-Mitgliedsnummer?
                </label>
              </div>

              {/* USV Number Input (conditional) */}
              {hasUsvNumber && (
                <div className="ml-7 space-y-3">
                  <div>
                    <label htmlFor="usvNumber" className="block text-sm font-medium text-gray-700">
                      USV-Mitgliedsnummer
                    </label>
                    <input
                      id="usvNumber"
                      name="usvNumber"
                      type="text"
                      placeholder="z.B. USV123456"
                      value={usvNumber}
                      onChange={(e) => setUsvNumber(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  <GratisBadge size="md" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? 'Wird registriert...' : 'Jetzt dabei sein!'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Bereits registriert? Jetzt anmelden
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
