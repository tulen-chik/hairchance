import { ReactNode } from 'react'
import Link from 'next/link'

export function Layout({ children }: { children: ReactNode }) {
  return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-black text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="HairChance Logo" className="w-12 h-12"/>
              <span className="text-2xl font-handwriting">HairChance</span>
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="#services" className="hover:text-amber-200 transition">Услуги</Link></li>
                <li><Link href="#team" className="hover:text-amber-200 transition">Команда</Link></li>
                <li><Link href="#reviews" className="hover:text-amber-200 transition">Отзывы</Link></li>
                <li><Link href="#contacts" className="hover:text-amber-200 transition">Контакты</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto flex justify-between">
            <div>
              <img src="./images/podvalfoto.png" alt="Footer Image" className="w-[300px] h-[200px]"/>
              <h2 className="text-4xl font-handwriting mt-4">
                Парикмахерская<br/>«ШАНС»
              </h2>
              <div className="flex space-x-4 mt-4">
                <a href="https://t.me/+P_Ff_B4sKVdlMjgy">
                  <img src="./images/Tg.png" alt="Telegram" className="w-8 h-8"/>
                </a>
                <a href="https://www.instagram.com/llevchh/#">
                  <img src="./images/Inst.png" alt="Instagram" className="w-8 h-8"/>
                </a>
                <a href="https://invite.viber.com/?g2=AQBAM9s85RVFoFPWGdsYUxAirzqfJfdddiWjmDjWF5xqrl3Spbk%2FjBjLAFGRBcFR">
                  <img src="./images/Viber.png" alt="Viber" className="w-8 h-8"/>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-2xl mb-4">Контакты</h3>
              <div className="flex items-center mb-2">
                <img src="./images/Telefon.png" alt="Phone" className="w-6 h-6 mr-2"/>
                <span>+375 (33) 365-92-10</span>
              </div>
              <div className="flex items-center mb-2">
                <img src="./images/Time.png" alt="Time" className="w-6 h-6 mr-2"/>
                <span>9:00 - 21:00 (без выходных)</span>
              </div>
              <div className="flex items-center">
                <img src="./images/metka1.png" alt="Location" className="w-6 h-6 mr-2"/>
                <span>Г. Минск Ул. Брилевская Д.37</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
  )
}

