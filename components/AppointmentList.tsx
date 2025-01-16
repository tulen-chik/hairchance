'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Appointment {
  id: number
  stylist_id: number
  service_id: number
  client_name: string
  client_phone: string
  client_email: string
  date: string
  time: string
  status: string
}

interface Stylist {
  id: number
  name: string
}

interface Service {
  id: number
  name: string
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>({
    stylist_id: 0,
    service_id: 0,
    client_name: '',
    client_phone: '',
    client_email: '',
    date: '',
    time: '',
    status: 'pending'
  })
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()
    fetchStylists()
    fetchServices()
  }, [])

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments:', error)
    } else {
      setAppointments(data)
    }
  }

  const fetchStylists = async () => {
    const { data, error } = await supabase.from('stylists').select('id, name')
    if (error) console.error('Error fetching stylists:', error)
    else setStylists(data)
  }

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('id, name')
    if (error) console.error('Error fetching services:', error)
    else setServices(data)
  }

  const handleAddAppointment = async () => {
    const { data, error } = await supabase.from('appointments').insert(newAppointment)
    if (error) console.error('Error adding appointment:', error)
    else {
      fetchAppointments()
      setNewAppointment({
        stylist_id: 0,
        service_id: 0,
        client_name: '',
        client_phone: '',
        client_email: '',
        date: '',
        time: '',
        status: 'pending'
      })
    }
  }

  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return
    const { data, error } = await supabase
      .from('appointments')
      .update(editingAppointment)
      .eq('id', editingAppointment.id)
    if (error) console.error('Error updating appointment:', error)
    else {
      fetchAppointments()
      setEditingAppointment(null)
    }
  }

  const handleDeleteAppointment = async (id: number) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) console.error('Error deleting appointment:', error)
    else fetchAppointments()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить новую запись</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stylist">Мастер</Label>
              <Select
                onValueChange={(value) => setNewAppointment({ ...newAppointment, stylist_id: parseInt(value) })}
              >
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
            <div className="space-y-2">
              <Label htmlFor="service">Услуга</Label>
              <Select
                onValueChange={(value) => setNewAppointment({ ...newAppointment, service_id: parseInt(value) })}
              >
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
            <div className="space-y-2">
              <Label htmlFor="client_name">Имя клиента</Label>
              <Input
                id="client_name"
                value={newAppointment.client_name}
                onChange={(e) => setNewAppointment({ ...newAppointment, client_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_phone">Телефон клиента</Label>
              <Input
                id="client_phone"
                value={newAppointment.client_phone}
                onChange={(e) => setNewAppointment({ ...newAppointment, client_phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_email">Email клиента</Label>
              <Input
                id="client_email"
                value={newAppointment.client_email}
                onChange={(e) => setNewAppointment({ ...newAppointment, client_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Время</Label>
              <Input
                id="time"
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                onValueChange={(value) => setNewAppointment({ ...newAppointment, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddAppointment}>Добавить запись</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список записей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Клиент</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Мастер</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.client_name}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{stylists.find(s => s.id === appointment.stylist_id)?.name}</TableCell>
                  <TableCell>{services.find(s => s.id === appointment.service_id)?.name}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingAppointment(appointment)}>Редактировать</Button>
                    <Button variant="destructive" onClick={() => handleDeleteAppointment(appointment.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingAppointment && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать запись</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stylist">Мастер</Label>
                <Select
                  value={editingAppointment.stylist_id.toString()}
                  onValueChange={(value) => setEditingAppointment({ ...editingAppointment, stylist_id: parseInt(value) })}
                >
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
              <div className="space-y-2">
                <Label htmlFor="edit-service">Услуга</Label>
                <Select
                  value={editingAppointment.service_id.toString()}
                  onValueChange={(value) => setEditingAppointment({ ...editingAppointment, service_id: parseInt(value) })}
                >
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
              <div className="space-y-2">
                <Label htmlFor="edit-client_name">Имя клиента</Label>
                <Input
                  id="edit-client_name"
                  value={editingAppointment.client_name}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, client_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client_phone">Телефон клиента</Label>
                <Input
                  id="edit-client_phone"
                  value={editingAppointment.client_phone}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, client_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client_email">Email клиента</Label>
                <Input
                  id="edit-client_email"
                  value={editingAppointment.client_email}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, client_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Дата</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingAppointment.date}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Время</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingAppointment.time}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Статус</Label>
                <Select
                  value={editingAppointment.status}
                  onValueChange={(value) => setEditingAppointment({ ...editingAppointment, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидание</SelectItem>
                    <SelectItem value="confirmed">Подтверждено</SelectItem>
                    <SelectItem value="cancelled">Отменено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="mt-4" onClick={handleUpdateAppointment}>Сохранить изменения</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

