'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Service {
  id: number
  name: string
  duration: number
}

interface Stylist {
  id: number
  name: string
}

export function Booking() {
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [clientName, setClientName] = useState<string>('')
  const [clientPhone, setClientPhone] = useState<string>('')
  const [clientEmail, setClientEmail] = useState<string>('')

  useEffect(() => {
    fetchServices()
    fetchStylists()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*')
    if (error) console.error('Error fetching services:', error)
    else setServices(data)
  }

  const fetchStylists = async () => {
    const { data, error } = await supabase.from('stylists').select('*')
    if (error) console.error('Error fetching stylists:', error)
    else setStylists(data)
  }

  const fetchAvailableTimes = async () => {
    if (!selectedStylist || !selectedDate || !selectedService) return

    const startTime = 9 * 60 // 9:00 AM in minutes
    const endTime = 18 * 60 // 6:00 PM in minutes
    const selectedServiceDuration = services.find(s => s.id === selectedService)?.duration || 60

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('stylist_id', selectedStylist)
      .eq('date', selectedDate)

    if (error) {
      console.error('Error fetching appointments:', error)
      return
    }

    const bookedTimes = appointments.map(apt => apt.time)
    const availableTimes = []

    for (let i = startTime; i < endTime; i += 30) {
      const hour = Math.floor(i / 60)
      const minute = i % 60
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

      if (!bookedTimes.includes(time)) {
        const endTimeMinutes = i + selectedServiceDuration
        const endHour = Math.floor(endTimeMinutes / 60)
        const endMinute = endTimeMinutes % 60
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`

        if (endTimeMinutes <= 18 * 60) {
          availableTimes.push(time)
        }
      }
    }

    setAvailableTimes(availableTimes)
  }

  useEffect(() => {
    fetchAvailableTimes()
  }, [selectedStylist, selectedDate, selectedService])

  const handleBooking = async () => {
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        service_id: selectedService,
        stylist_id: selectedStylist,
        date: selectedDate,
        time: selectedTime,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail,
        status: 'pending'
      })

    if (error) {
      console.error('Error booking appointment:', error)
      alert('Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз.')
    } else {
      alert('Запись успешно создана!')
      // Reset form
      setSelectedService(null)
      setSelectedStylist(null)
      setSelectedDate('')
      setSelectedTime('')
      setClientName('')
      setClientPhone('')
      setClientEmail('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Записаться на прием</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="service">Услуга</Label>
            <Select onValueChange={(value) => setSelectedService(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stylist">Мастер</Label>
            <Select onValueChange={(value) => setSelectedStylist(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите мастера" />
              </SelectTrigger>
              <SelectContent>
                {stylists.map((stylist) => (
                  <SelectItem key={stylist.id} value={stylist.id.toString()}>{stylist.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="time">Время</Label>
            <Select onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите время" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="clientName">Ваше имя</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Ваш телефон</Label>
            <Input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Ваш email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleBooking}>Записаться</Button>
        </div>
      </CardContent>
    </Card>
  )
}

