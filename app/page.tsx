'use client'

import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getReviews } from './actions';
import { supabase } from '../utils/supabase';
import { BookingModal } from '../components/BookingModal';
import { ReviewModal } from '../components/ReviewModal';

interface Review {
  id: number;
  name: string;
  review: string;
  rating: number;
}

interface Stylist {
  id: number;
  name: string;
  specialization: string;
  image_url?: string;
}

const mainServices = [
  { name: 'Мужская стрижка', price: '30р', image: './images/muzskaya.jpg' },
  { name: 'Женская стрижка', price: '40р', image: './images/Zenskaya.png' },
  { name: 'Моделирование бороды', price: '20р', image: './images/Modelirovanie.png' },
  { name: 'Бритьё', price: '25р', image: './images/Britye.png' },
  { name: 'Стрижка машинкой', price: '15р', image: './images/Mashinka.png' },
  { name: 'Детская стрижка', price: '25р', image: './images/Kids.png' },
  { name: 'Первая стрижка', price: '-15%', image: './images/Perv.png' },
];

const additionalServices = [
  { name: 'Камуфляж седины', price: '25р', image: './images/kamufiaz.png' },
  { name: 'Черная маска', price: '15р', image: './images/Black mask.png' },
  { name: 'Коррекция воском', price: '10р', image: './images/korekcvosk.png' },
  { name: 'Укладка волос', price: '15р', image: './images/ukladka.png' },
  { name: 'Патчи', price: '15р', image: './images/patci.png' },
];

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedReviews = await getReviews();
      setReviews(fetchedReviews);

      const { data: stylistsData } = await supabase.from('stylists').select('*');
      setStylists(stylistsData || []);
    };
    fetchData();
  }, []);

  return (
      <Layout>
        <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
        />

        <section className="relative text-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <img
                src={"./images/pggg.jpg"}
                alt="Background"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-6xl font-handwriting mb-8">ПАРИКМАХЕРСКАЯ «ШАНС»</h2>
            <p className="text-xl max-w-3xl mx-auto mb-12">
              Парикмахерская «Шанс» — это стильное и уютное место, где каждая деталь продумана для вашего комфорта
              и красоты. Наша команда профессиональных стилистов и парикмахеров готова предложить широкий спектр услуг,
              от классических стрижек до современных окрашиваний и укладок.
            </p>
            <Button
                onClick={() => setIsBookingOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full text-lg"
            >
              Записаться
            </Button>
            <div className="flex items-center justify-center mt-12">
              <img src={"./images/metka.png"} alt="Location" className="w-9 h-9"/>
              <span className="ml-2">Г. Минск Ул. Брилевская Д.37</span>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-5xl font-handwriting text-amber-500 text-center mb-12">О нас</h2>
            <p className="text-xl max-w-3xl mx-auto text-center">
              Шанс - это уютное и стильное место, где каждый клиент может получить не только качественные услуги, но и
              индивидуальный подход. Наша команда профессиональных парикмахеров и стилистов готова предложить широкий спектр услуг,
              включая стрижки, укладки, окрашивание и уход за волосами.
            </p>
          </div>
        </section>

        <section id="services" className="py-20 bg-zinc-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Наши услуги</h2>

            {/* Main Services */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {mainServices.map((service, index) => (
                  <Card key={index} className="bg-zinc-800 border-none text-white overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-lg font-semibold text-center px-4">{service.name}</h3>
                          <p className="text-amber-500 font-bold mt-2">{service.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>

            {/* Additional Services */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {additionalServices.map((service, index) => (
                  <Card key={index} className="bg-zinc-800 border-none text-white overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-lg font-semibold text-center px-4">{service.name}</h3>
                          <p className="text-amber-500 font-bold mt-2">{service.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full text-lg"
              >
                Записаться
              </Button>
            </div>
          </div>
        </section>

        <section id="team" className="py-20 bg-zinc-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Наши мастера</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stylists.map((stylist) => (
                  <div key={stylist.id} className="text-center">
                    <div className="mb-4 relative">
                      <div className="w-48 h-48 mx-auto rounded-full overflow-hidden">
                        <img
                            src={stylist.image_url || "/placeholder.svg"}
                            alt={stylist.name}
                            className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{stylist.name}</h3>
                    <p className="text-gray-400">{stylist.specialization}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section id="photos" className="py-20 bg-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-handwriting mb-12">
              <span className="text-black">Наш</span>{' '}
              <span className="text-amber-500">Instagram</span>
            </h2>
            <img src="./images/Colladz.png" alt="Instagram Collage" className="w-[1000px] h-[500px] mx-auto mb-8"/>
            <button
                onClick={() => window.open('https://www.instagram.com/llevchh/#', '_blank')}
                className="bg-amber-200 text-black px-8 py-3 rounded-lg text-xl font-semibold hover:bg-amber-300 transition"
            >
              Перейти в instagram
            </button>
          </div>
        </section>

        <section id="reviews" className="py-20 bg-zinc-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Отзывы</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.slice(0, 3).map((review, index) => (
                  <Card key={index} className="bg-zinc-800 border-none text-white">
                    <CardContent className="p-6">
                      <p className="mb-4">{review.review}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full text-lg"
              >
                Оставить отзыв
              </Button>
            </div>
          </div>
        </section>

        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
        />
      </Layout>
  );
}