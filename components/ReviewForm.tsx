'use client'

import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from 'lucide-react'

export function ReviewForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { error } = await supabase
      .from('reviews')
      .insert({
        name,
        email,
        review,
        rating
      })

    setIsSubmitting(false)

    if (error) {
      alert('Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте еще раз.')
    } else {
      alert('Спасибо за ваш отзыв!')
      setName('')
      setEmail('')
      setReview('')
      setRating(5)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ваше имя</label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ваш отзыв</label>
            <Textarea
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Расскажите о вашем опыте"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Оценка</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

