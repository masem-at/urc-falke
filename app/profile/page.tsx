'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, Save, X, Upload, User as UserIcon } from 'lucide-react'
import { GratisBadge } from '@/components/ui/GratisBadge'
import { FoundingMemberBadge } from '@/components/ui/FoundingMemberBadge'
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog'
import { triggerConfetti } from '@/lib/confetti'
import { getDisplayName } from '@/lib/utils/display-name'

interface User {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  nickname: string | null
  profile_image_url: string | null
  role: string
  onboarding_status: string
  must_change_password: boolean
  usv_number: string | null
  is_usv_verified: boolean
  is_founding_member: boolean
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // User data state
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

  // UI state
  const [isSaving, setSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/v1/users/me')

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Fehler beim Laden der Benutzerdaten')
        }

        const data = await response.json()
        setUser(data)
        setFirstName(data.first_name || '')
        setLastName(data.last_name || '')
        setNickname(data.nickname || '')
        setProfileImageUrl(data.profile_image_url)
      } catch (err) {
        setError('Fehler beim Laden der Benutzerdaten')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  // Show toast and auto-hide after 5 seconds
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  // Handle edit mode activation
  const handleEditClick = () => {
    setIsEditing(true)
  }

  // Handle cancel - revert changes and exit edit mode
  const handleCancelClick = () => {
    if (!user) return

    setFirstName(user.first_name || '')
    setLastName(user.last_name || '')
    setNickname(user.nickname || '')
    setImagePreview(null)
    setIsEditing(false)
  }

  // Handle save - update profile via API
  const handleSaveClick = async () => {
    if (!user) return

    setSaving(true)

    try {
      // Prepare update payload (only changed fields)
      const updates: Record<string, string> = {}
      if (firstName !== (user.first_name || '')) updates.firstName = firstName
      if (lastName !== (user.last_name || '')) updates.lastName = lastName
      if (nickname !== (user.nickname || '')) updates.nickname = nickname

      // Only send PATCH if there are changes
      if (Object.keys(updates).length > 0) {
        const response = await fetch('/api/v1/users/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Fehler beim Speichern')
        }

        const { user: updatedUser } = await response.json()
        setUser(updatedUser)
      }

      // Exit edit mode
      setIsEditing(false)

      // Show success message
      showToast('success', 'Profil erfolgreich aktualisiert!')

      // Trigger confetti celebration
      triggerConfetti({ duration: 1500, particleCount: 100 })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Speichern'
      showToast('error', message)
    } finally {
      setSaving(false)
    }
  }

  // Handle profile image selection
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

    if (file.size > MAX_FILE_SIZE) {
      showToast('error', 'Die Datei darf maximal 5MB groß sein.')
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('error', 'Nur JPG, PNG und WebP Dateien sind erlaubt.')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to API
    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/v1/users/me/profile-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Fehler beim Hochladen')
      }

      const { profileImageUrl: newUrl } = await response.json()
      setProfileImageUrl(newUrl)

      // Update user state
      if (user) {
        setUser({ ...user, profile_image_url: newUrl })
      }

      showToast('success', 'Profilbild erfolgreich hochgeladen!')
      setImagePreview(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Hochladen'
      showToast('error', message)
      setImagePreview(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const response = await fetch('/api/v1/users/me', {
      method: 'DELETE'
    })

    if (response.ok) {
      // Redirect to homepage with deleted flag for success message
      router.push('/?deleted=true')
    } else {
      const data = await response.json()
      throw new Error(data.detail || 'Fehler beim Löschen des Accounts')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Lädt...</p>
      </div>
    )
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Benutzer nicht gefunden'}</p>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-500"
          >
            Zur Anmeldung
          </button>
        </div>
      </div>
    )
  }

  const displayName = getDisplayName({
    nickname: user.nickname,
    first_name: user.first_name,
    last_name: user.last_name,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">URC</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">URC Falke</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 min-h-[44px]"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 min-h-[44px]"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Toast Notification */}
          {toast && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                toast.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
              role="alert"
              aria-live="polite"
            >
              {toast.message}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Header */}
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mein Profil</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Verwalte deine Profildaten
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
                  aria-label="Profil bearbeiten"
                >
                  <Edit2 size={18} aria-hidden="true" />
                  <span className="hidden sm:inline">Profil bearbeiten</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelClick}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] disabled:opacity-50"
                    aria-label="Abbrechen"
                  >
                    <X size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">Abbrechen</span>
                  </button>
                  <button
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] disabled:opacity-50"
                    aria-label="Änderungen speichern"
                  >
                    <Save size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {isSaving ? 'Speichert...' : 'Speichern'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Content */}
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {/* Profile Image */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative">
                  {imagePreview || profileImageUrl ? (
                    <img
                      src={imagePreview || profileImageUrl!}
                      alt="Profilbild"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <UserIcon size={48} className="text-gray-400" aria-hidden="true" />
                    </div>
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <p className="text-white text-sm">Lädt...</p>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="profile-image-input"
                      aria-label="Profilbild auswählen"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] disabled:opacity-50"
                      aria-label="Profilbild hochladen"
                    >
                      <Upload size={18} aria-hidden="true" />
                      Profilbild hochladen
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      Max. 5MB • JPG, PNG oder WebP
                    </p>
                  </>
                )}
              </div>

              {/* Display Name */}
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Badges */}
              <div className="mb-6 flex flex-wrap justify-center gap-3">
                {user.is_usv_verified && <GratisBadge size="lg" />}
                {user.is_founding_member && <FoundingMemberBadge size="lg" />}
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Vorname
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      placeholder="Vorname eingeben"
                      aria-label="Vorname"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user.first_name || <span className="text-gray-400 italic">Nicht angegeben</span>}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nachname
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      placeholder="Nachname eingeben"
                      aria-label="Nachname"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user.last_name || <span className="text-gray-400 italic">Nicht angegeben</span>}
                    </p>
                  )}
                </div>

                {/* Nickname */}
                <div>
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Spitzname
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      placeholder="Spitzname eingeben (optional)"
                      aria-label="Spitzname"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">
                      {user.nickname || <span className="text-gray-400 italic">Nicht angegeben</span>}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Wird in Teilnehmerlisten angezeigt
                  </p>
                </div>

                {/* USV Number (read-only) */}
                {user.usv_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      USV-Nummer
                    </label>
                    <p className="text-gray-900 py-2">{user.usv_number}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone - Account Deletion (DSGVO) */}
          <section className="mt-12 p-6 border-2 border-red-500 rounded-lg bg-white">
            <h2 className="text-xl font-bold text-red-700 mb-4">Gefahrenbereich</h2>
            <p className="text-gray-600 mb-4">
              Hier kannst du deinen Account und alle zugehörigen Daten dauerhaft löschen.
            </p>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="min-h-[44px] min-w-[44px] px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Account löschen
            </button>
          </section>
        </div>
      </main>

      {/* Delete Account Confirmation Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}
