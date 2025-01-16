'use client'

import { ServiceManager } from '@/components/ServiceManager'

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Управление услугами</h1>
      <ServiceManager />
    </div>
  )
}

