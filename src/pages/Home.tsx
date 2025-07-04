
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Globe, Facebook, Instagram } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 px-4 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent leading-tight">
                Universitas Klabat
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
                Sistem Informasi Kampus dengan AI Chatbot
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Dapatkan informasi lengkap tentang program studi, biaya, jadwal akademik, 
                dan segala hal tentang UNKLAB dengan mudah dan cepat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <Link to="/chatbot">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Tanya Chatbot
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-violet-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-300 rounded-full opacity-25 animate-pulse delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-violet-300 rounded-full opacity-15 animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-violet-600 text-white py-6 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Ikuti Kami</h3>
              <p className="text-purple-100 text-sm">Dapatkan informasi terbaru dari UNKLAB</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {/* Website Button */}
              <a 
                href="https://unklab.ac.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm hover:scale-105"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Website</span>
              </a>

              {/* Instagram Button */}
              <a 
                href="https://www.instagram.com/unklabofficial/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-sm font-medium">Instagram</span>
              </a>

              {/* Facebook Button */}
              <a 
                href="https://www.facebook.com/p/UNKLAB-Official-100082571173139/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
                <span className="text-sm font-medium">Facebook</span>
              </a>

              {/* TikTok Button */}
              <a 
                href="https://www.tiktok.com/@unklab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm hover:scale-105"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="text-sm font-medium">TikTok</span>
              </a>
            </div>

            <div className="text-center text-purple-100 text-xs pt-2 border-t border-white/10 w-full">
              <p>&copy; 2024 Universitas Klabat. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
