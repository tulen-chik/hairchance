'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentList } from './AppointmentList'
import { AdminReviews } from './AdminReviews'
import { StylistSchedule } from './StylistSchedule'
import { ServiceManager } from './ServiceManager'
import { StylistManager } from './StylistManager'

export function AdminDashboard() {
  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="appointments">Записи</TabsTrigger>
        <TabsTrigger value="services">Услуги</TabsTrigger>
        <TabsTrigger value="stylists">Мастера</TabsTrigger>
        <TabsTrigger value="reviews">Отзывы</TabsTrigger>
        <TabsTrigger value="schedule">Расписание</TabsTrigger>
      </TabsList>
      <TabsContent value="appointments">
        <AppointmentList />
      </TabsContent>
      <TabsContent value="services">
        <ServiceManager />
      </TabsContent>
      <TabsContent value="stylists">
        <StylistManager />
      </TabsContent>
      <TabsContent value="reviews">
        <AdminReviews />
      </TabsContent>
      <TabsContent value="schedule">
        <StylistSchedule />
      </TabsContent>
    </Tabs>
  )
}

