
import { useState } from 'react';
import { ChatBot } from '@/components/ChatBot';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, MessageCircle, Settings, Database, Sparkles } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chatbot');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-3 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                  UNKLAB Info Bot
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  Sistem Informasi Kampus Universitas Klabat
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant={activeTab === 'chatbot' ? 'default' : 'outline'}
                onClick={() => setActiveTab('chatbot')}
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chatbot</span>
              </Button>
              <Button
                variant={activeTab === 'admin' ? 'default' : 'outline'}
                onClick={() => setActiveTab('admin')}
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105"
              >
                <Settings className="h-4 w-4" />
                <span>Admin Panel</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'chatbot' ? (
          <div className="space-y-8 animate-fade-in">
            <Card className="p-8 shadow-xl border border-purple-100 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Chatbot Interface
                </h2>
                <div className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  T02, T03, T04, T11
                </div>
              </div>
              <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
                Interface chatbot untuk memberikan informasi kampus dengan NLP dan estimasi biaya. 
                Tanyakan apapun tentang UNKLAB dan dapatkan jawaban yang akurat!
              </p>
              <ChatBot />
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <Card className="p-8 shadow-xl border border-purple-100 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg mr-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Admin Panel
                </h2>
                <div className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  T05, T06, T07, T08, T09, T10
                </div>
              </div>
              <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
                Panel admin untuk mengelola data kampus, crawling, dan monitoring sistem. 
                Kelola semua aspek sistem informasi UNKLAB dengan mudah.
              </p>
              <AdminPanel />
            </Card>
          </div>
        )}
      </main>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 UNKLAB Info Bot - Prototype System
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Version 1.0
              </span>
              <span>•</span>
              <span>Development Stage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
