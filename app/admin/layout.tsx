'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Calendar, ClipboardList, Users, Settings, Star } from 'lucide-react'
import { getSession, signOut } from '@/utils/auth'
import { AdminLogin } from '@/components/AdminLogin'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const session = await getSession()
      setIsLoggedIn(!!session)
    } catch (error) {
      console.error('Error checking authentication:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      localStorage.removeItem('adminUser')
      setIsLoggedIn(false)
      router.push('/admin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <img src="/images/logo.png" alt="HairChance Logo" className="w-8 h-8" />
              <span className="font-semibold">HairChance Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/appointments">
                    <Calendar className="w-4 h-4" />
                    <span>Записи</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/services">
                    <ClipboardList className="w-4 h-4" />
                    <span>Услуги</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/stylists">
                    <Users className="w-4 h-4" />
                    <span>Мастера</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/admin/reviews">
                    <Star className="w-4 h-4" />
                    <span>Отзывы</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <Settings className="w-4 h-4" />
                  <span>Выйти</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

