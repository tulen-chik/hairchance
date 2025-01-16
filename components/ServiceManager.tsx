'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Service {
  id: number
  name: string
  category: string
  price: number
  duration: number
}

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({ name: '', category: '', price: 0, duration: 0 })
  const [editingService, setEditingService] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*')
    if (error) console.error('Error fetching services:', error)
    else setServices(data)
  }

  const handleAddService = async () => {
    const { data, error } = await supabase.from('services').insert(newService)
    if (error) console.error('Error adding service:', error)
    else {
      fetchServices()
      setNewService({ name: '', category: '', price: 0, duration: 0 })
    }
  }

  const handleUpdateService = async () => {
    if (!editingService) return
    const { data, error } = await supabase
      .from('services')
      .update({ name: editingService.name, category: editingService.category, price: editingService.price, duration: editingService.duration })
      .eq('id', editingService.id)
    if (error) console.error('Error updating service:', error)
    else {
      fetchServices()
      setEditingService(null)
    }
  }

  const handleDeleteService = async (id: number) => {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) console.error('Error deleting service:', error)
    else fetchServices()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить новую услугу</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Цена</Label>
              <Input
                id="price"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Длительность (мин)</Label>
              <Input
                id="duration"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddService}>Добавить услугу</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список услуг</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.price} р</TableCell>
                  <TableCell>{service.duration} мин</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingService(service)}>Редактировать</Button>
                    <Button variant="destructive" onClick={() => handleDeleteService(service.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingService && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать услугу</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Категория</Label>
                <Input
                  id="edit-category"
                  value={editingService.category}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Цена</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Длительность (мин)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({ ...editingService, duration: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleUpdateService}>Сохранить изменения</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

