'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Stylist {
  id: number
  name: string
  specialization: string
  image_url: string
}

export function StylistManager() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [newStylist, setNewStylist] = useState<Omit<Stylist, 'id'>>({ name: '', specialization: '', image_url: '' })
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null)

  useEffect(() => {
    fetchStylists()
  }, [])

  const fetchStylists = async () => {
    const { data, error } = await supabase.from('stylists').select('*')
    if (error) console.error('Error fetching stylists:', error)
    else setStylists(data)
  }

  const handleAddStylist = async () => {
    const { data, error } = await supabase.from('stylists').insert(newStylist)
    if (error) console.error('Error adding stylist:', error)
    else {
      fetchStylists()
      setNewStylist({ name: '', specialization: '', image_url: '' })
    }
  }

  const handleUpdateStylist = async () => {
    if (!editingStylist) return
    const { data, error } = await supabase
      .from('stylists')
      .update({ name: editingStylist.name, specialization: editingStylist.specialization, image_url: editingStylist.image_url })
      .eq('id', editingStylist.id)
    if (error) console.error('Error updating stylist:', error)
    else {
      fetchStylists()
      setEditingStylist(null)
    }
  }

  const handleDeleteStylist = async (id: number) => {
    const { error } = await supabase.from('stylists').delete().eq('id', id)
    if (error) console.error('Error deleting stylist:', error)
    else fetchStylists()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Добавить нового мастера</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={newStylist.name}
                onChange={(e) => setNewStylist({ ...newStylist, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Специализация</Label>
              <Input
                id="specialization"
                value={newStylist.specialization}
                onChange={(e) => setNewStylist({ ...newStylist, specialization: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                value={newStylist.image_url}
                onChange={(e) => setNewStylist({ ...newStylist, image_url: e.target.value })}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddStylist}>Добавить мастера</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список мастеров</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Специализация</TableHead>
                <TableHead>Изображение</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stylists.map((stylist) => (
                <TableRow key={stylist.id}>
                  <TableCell>{stylist.name}</TableCell>
                  <TableCell>{stylist.specialization}</TableCell>
                  <TableCell>
                    <img src={stylist.image_url || "/placeholder.svg"} alt={stylist.name} className="w-12 h-12 object-cover rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingStylist(stylist)}>Редактировать</Button>
                    <Button variant="destructive" onClick={() => handleDeleteStylist(stylist.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingStylist && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать мастера</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Имя</Label>
                <Input
                  id="edit-name"
                  value={editingStylist.name}
                  onChange={(e) => setEditingStylist({ ...editingStylist, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Специализация</Label>
                <Input
                  id="edit-specialization"
                  value={editingStylist.specialization}
                  onChange={(e) => setEditingStylist({ ...editingStylist, specialization: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-image_url">URL изображения</Label>
                <Input
                  id="edit-image_url"
                  value={editingStylist.image_url}
                  onChange={(e) => setEditingStylist({ ...editingStylist, image_url: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleUpdateStylist}>Сохранить изменения</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

