"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "../utils/supabase"

interface Service {
  id: number
  name: string
  price: number
  duration: number
  category: string
}

interface Stylist {
  id: number
  name: string
  image_url: string
  specialization: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [clientInfo, setClientInfo] = useState({
    name: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    fetchServices()
    fetchStylists()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*")
    if (!error && data) setServices(data)
  }

  const fetchStylists = async () => {
    const { data, error } = await supabase.from("stylists").select("*")
    if (!error && data) setStylists(data)
  }

  const checkAvailability = async () => {
    if (!selectedStylist || !selectedDate) return

    const date = format(selectedDate, "yyyy-MM-dd")

    // Get existing confirmed appointments
    const { data: existingAppointments, error } = await supabase
        .from("appointments")
        .select("time")
        .eq("stylist_id", selectedStylist.id)
        .eq("date", date)
        .eq("status", "confirmed")

    if (error) {
      console.error("Error checking availability:", error)
      return
    }

    const bookedTimes = existingAppointments.map((apt) => apt.time)
    const selectedServiceData = services.find((service) => service.id === selectedService)
    const totalDuration = selectedServiceData ? selectedServiceData.duration : 0

    // Generate available time slots
    const timeSlots = []
    const startHour = 9 // 9:00
    const endHour = 21 // 21:00
    const interval = 30 // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

        // Check if this time slot overlaps with any booked appointments
        const isAvailable = !bookedTimes.some((bookedTime) => {
          const [bookedHour, bookedMinute] = bookedTime.split(":").map(Number)
          const bookedTimeInMinutes = bookedHour * 60 + bookedMinute
          const currentTimeInMinutes = hour * 60 + minute

          return Math.abs(bookedTimeInMinutes - currentTimeInMinutes) < totalDuration
        })

        if (isAvailable) {
          timeSlots.push(timeString)
        }
      }
    }

    setAvailableTimes(timeSlots)
  }

  useEffect(() => {
    if (selectedStylist && selectedDate) {
      checkAvailability()
    }
  }, [selectedStylist, selectedDate, selectedService])

  const handleBooking = async () => {
    if (!selectedStylist || !selectedDate || !selectedTime || !selectedService) {
      alert("Пожалуйста, заполните все поля")
      return
    }

    // Check for existing confirmed appointments one last time
    const { data: existingAppointments, error: checkError } = await supabase
        .from("appointments")
        .select("*")
        .eq("stylist_id", selectedStylist.id)
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .eq("time", selectedTime)
        .eq("status", "confirmed")

    if (checkError) {
      console.error("Error checking appointments:", checkError)
      return
    }

    if (existingAppointments.length > 0) {
      alert("Извините, это время уже занято. Пожалуйста, выберите другое время.")
      return
    }

    const { error } = await supabase.from("appointments").insert({
      stylist_id: selectedStylist.id,
      service_id: selectedService, // Assuming we're only allowing one service per appointment for now
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      client_name: clientInfo.name,
      client_phone: clientInfo.phone,
      client_email: clientInfo.email,
      status: "pending",
    })

    if (error) {
      console.error("Error booking appointment:", error)
      alert("Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз.")
    } else {
      alert("Запись успешно создана!")
      onClose()
      setStep(1)
      setSelectedStylist(null)
      setSelectedService(null)
      setSelectedDate(undefined)
      setSelectedTime(null)
      setClientInfo({ name: "", phone: "", email: "" })
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Выбор специалиста</h2>
              <div className="grid grid-cols-1 gap-4">
                {stylists.map((stylist) => (
                    <div
                        key={stylist.id}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors
                    ${selectedStylist?.id === stylist.id ? "bg-amber-100" : "hover:bg-gray-100"}`}
                        onClick={() => setSelectedStylist(stylist)}
                    >
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={stylist.image_url} alt={stylist.name} />
                        <AvatarFallback>{stylist.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{stylist.name}</h3>
                        <p className="text-sm text-gray-500">{stylist.specialization}</p>
                      </div>
                      <Button variant="outline" className="ml-4" onClick={() => setSelectedStylist(stylist)}>
                        Выбрать мастера
                      </Button>
                    </div>
                ))}
              </div>
            </div>
        )

      case 2:
        return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Выбор услуги</h2>
              <div className="grid grid-cols-1 gap-2">
                {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id={`service-${service.id}`}
                          checked={selectedService === service.id}
                          onChange={() => setSelectedService(service.id)}
                      />
                      <label htmlFor={`service-${service.id}`} className="flex flex-1 items-center justify-between text-sm">
                        <span>{service.name}</span>
                        <span>{service.price} р</span>
                      </label>
                    </div>
                ))}
              </div>
            </div>
        )

      case 3:
        return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Выбор даты и времени</h2>
              <div className="grid gap-4">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={ru}
                    className="rounded-md border"
                />
                {selectedDate && (
                    <div className="grid gap-4 max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <h3 className="font-medium mb-2 sticky top-0 bg-white">Утро</h3>
                          {availableTimes
                              .filter((time) => {
                                const hour = Number.parseInt(time.split(":")[0])
                                return hour >= 9 && hour < 12
                              })
                              .map((time) => (
                                  <Button
                                      key={time}
                                      variant={selectedTime === time ? "default" : "outline"}
                                      className="w-full mb-2"
                                      onClick={() => setSelectedTime(time)}
                                  >
                                    {time}
                                  </Button>
                              ))}
                        </div>
                        <div>
                          <h3 className="font-medium mb-2 sticky top-0 bg-white">День</h3>
                          {availableTimes
                              .filter((time) => {
                                const hour = Number.parseInt(time.split(":")[0])
                                return hour >= 12 && hour < 17
                              })
                              .map((time) => (
                                  <Button
                                      key={time}
                                      variant={selectedTime === time ? "default" : "outline"}
                                      className="w-full mb-2"
                                      onClick={() => setSelectedTime(time)}
                                  >
                                    {time}
                                  </Button>
                              ))}
                        </div>
                        <div>
                          <h3 className="font-medium mb-2 sticky top-0 bg-white">Вечер</h3>
                          {availableTimes
                              .filter((time) => {
                                const hour = Number.parseInt(time.split(":")[0])
                                return hour >= 17 && hour < 21
                              })
                              .map((time) => (
                                  <Button
                                      key={time}
                                      variant={selectedTime === time ? "default" : "outline"}
                                      className="w-full mb-2"
                                      onClick={() => setSelectedTime(time)}
                                  >
                                    {time}
                                  </Button>
                              ))}
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>
        )

      case 4:
        return (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Ваши контакты</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Имя</label>
                  <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Телефон</label>
                  <input
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                      type="email"
                      className="w-full p-2 border rounded-md"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
        )
    }
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="p-6">
            {renderStep()}
            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
              {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)} className="w-full sm:w-auto">
                    Назад
                  </Button>
              )}
              {step < 4 ? (
                  <Button
                      className="w-full sm:w-auto sm:ml-auto"
                      onClick={() => setStep(step + 1)}
                      disabled={
                          (step === 1 && !selectedStylist) ||
                          (step === 2 && !selectedService) ||
                          (step === 3 && (!selectedDate || !selectedTime))
                      }
                  >
                    Далее
                  </Button>
              ) : (
                  <Button
                      className="w-full sm:w-auto sm:ml-auto"
                      onClick={handleBooking}
                      disabled={!clientInfo.name || !clientInfo.phone || !clientInfo.email}
                  >
                    Записаться
                  </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}

