'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Review {
  id: number
  name: string
  email: string
  review: string
  rating: number
  created_at: string
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reviews:', error)
    } else {
      setReviews(data)
    }
  }

  const handleDeleteReview = async (id: number) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting review:', error)
    } else {
      fetchReviews()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Отзывы клиентов</h2>
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">{review.name}</p>
                <p className="text-sm text-gray-500">{review.email}</p>
                <p className="mt-2">{review.review}</p>
                <div className="flex mt-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">{new Date(review.created_at).toLocaleString()}</p>
              </div>
              <Button variant="destructive" onClick={() => handleDeleteReview(review.id)}>
                Удалить
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

