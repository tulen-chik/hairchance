'use client'

import { AdminReviews } from '@/components/AdminReviews'

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Управление отзывами</h1>
      <AdminReviews />
    </div>
  )
}

