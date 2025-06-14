import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import coin1 from '../assets/coin1.png'
import coin2 from '../assets/coin2.png'
import coin3 from '../assets/coin3.png'
import coin4 from '../assets/coin4.png'
import coin5 from '../assets/coin5.png'
import coin6 from '../assets/coin6.png'
import coin7 from '../assets/coin7.png'
import coin8 from '../assets/coin8.png'
import coin9 from '../assets/coin9.png'

export default function CurrencyCoins() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // Your coin data with actual images
  const coins = [
    { name: 'AUD', image: coin1 },
    { name: 'INR', image: coin2 },
    { name: 'NGN', image: coin3 },
    { name: 'Euro', image: coin4 },
    { name: 'PKR', image: coin5 },
    { name: 'USD', image: coin6 },
    { name: 'ETH', image: coin7 },
    { name: 'CAD', image: coin8 },
    { name: 'BTC', image: coin9 }
  ]

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % coins.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + coins.length) % coins.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (isSmallScreen) {
    // Slider for small screens
    return (
      <div className="w-full max-w-md mx-auto p-4">
        
        <div className="relative  rounded-xl shadow-lg overflow-hidden">
          {/* Slider Container */}
          <div className="relative h-64 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                {coins[currentIndex].name}
              </h3>
              <div className="w-16 h-16 bg-white p-1 rounded-full">
                <img 
                  src={coins[currentIndex].image} 
                  alt={coins[currentIndex].name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2  rounded-full border border-white p-2 shadow-md transition-all duration-200"
          >
            <ChevronLeft size={20} className="text-gray-300" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full border border-white p-2 shadow-md transition-all duration-200"
          >
            <ChevronRight size={20} className="text-gray-300" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 pb-4">
            {coins.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Grid layout for larger screens
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      
      <div className="grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-6 mt-10">
        {coins.map((coin, index) => (
          <div 
            key={index}
            className="flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <h3 className="text-sm font-semibold mb-3 text-gray-300 text-center min-h-[2rem] flex items-center">
              {coin.name}
            </h3>
            <div className="w-16 h-16 bg-white p-1 rounded-full">
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}