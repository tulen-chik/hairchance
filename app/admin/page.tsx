'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLogin } from '../../components/AdminLogin'
import { AdminDashboard } from '../../components/AdminDashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from '@/utils/auth'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession()
        if (session) {
          setIsLoggedIn(true)
          router.push("/admin/appointments")
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/admin/appointments")
    }
  }, [isLoggedIn, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoggedIn ? "Панель администратора" : "Вход для администратора"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isLoggedIn ? (
            <AdminLogin onLogin={() => setIsLoggedIn(true)} />
          ) : (
            <AdminDashboard />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

