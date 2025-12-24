'use client'

export const dynamic = 'force-dynamic'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">URC</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Events
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bald verfügbar - Veranstaltungen werden in Kürze hier angezeigt
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Zurück zum Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
