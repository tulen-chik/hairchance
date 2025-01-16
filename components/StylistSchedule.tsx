'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

interface Appointment {
  id: number
  client_name: string
  date: string
  time: string
  status: string
}

interface Stylist {
  id: number
  name: string
}

export function StylistSchedule() {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    fetchStylists()
  }, [])

  useEffect(() => {
    if (selectedStylist) {
      fetchAppointments()
    }
  }, [selectedStylist])

  const fetchStylists = async () => {
    const { data, error } = await supabase
      .from('stylists')
      .select('*')
    
    if (error) {
      console.error('Error fetching stylists:', error)
    } else {
      setStylists(data)
    }
  }

  const fetchAppointments = async () => {
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('stylist_id', selectedStylist)
      .gte('date', startOfWeek.toISOString().split('T')[0])
      .lte('date', endOfWeek.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('time', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments:', error)
    } else {
      setAppointments(data)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Stylist Weekly Schedule</h2>
      <select
        value={selectedStylist || ''}
        onChange={(e) => setSelectedStylist(Number(e.target.value))}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a stylist</option>
        {stylists.map((stylist) => (
          <option key={stylist.id} value={stylist.id}>{stylist.name}</option>
        ))}
      </select>
      {selectedStylist && (
        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Client</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.client_name}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

