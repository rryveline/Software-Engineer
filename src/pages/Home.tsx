
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent leading-tight">
                Universitas Klabat
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Sistem Informasi Kampus dengan AI Chatbot
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Dapatkan informasi lengkap tentang program studi, biaya, jadwal akademik, 
                dan segala hal tentang UNKLAB dengan mudah dan cepat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/chatbot">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-3 text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Tanya Chatbot
                </Button>
              </Link>
              <Link to="/login/user">
                <Button size="lg" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg">
                  <Users className="w-5 h-5 mr-2" />
                  Login User
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-violet-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
