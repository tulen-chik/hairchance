'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

interface Service {
  id: number
  name: string
  category: string
  price: number
}

export function ServiceSearch() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*')
    if (error) alert(error.message)
    else setServices(data)
  }

  useEffect(() => {
    setFilteredServices(
      services.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (category === '' || service.category === category)
      )
    )
  }, [searchTerm, category, services])

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search services"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded-md w-full"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 border rounded-md w-full"
      >
        <option value="">All categories</option>
        <option value="haircut">Haircut</option>
        <option value="coloring">Coloring</option>
        <option value="styling">Styling</option>
      </select>
      <ul className="space-y-2">
        {filteredServices.map((service) => (
          <li key={service.id} className="border p-4 rounded-md">
            <h3 className="font-bold">{service.name}</h3>
            <p>Category: {service.category}</p>
            <p>Price: ${service.price}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

