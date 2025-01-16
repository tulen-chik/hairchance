'use client'

import { StylistManager } from '@/components/StylistManager'

export default function StylistsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Управление мастерами</h1>
      <StylistManager />
    </div>
  )
}

