'use server'


import {supabase} from "@/utils/supabase";

export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data
}

