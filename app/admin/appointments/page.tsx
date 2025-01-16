'use client'

import { AppointmentList } from '@/components/AppointmentList'

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Управление записями</h1>
      <AppointmentList />
    </div>
  )
}

