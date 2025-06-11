
import { useState } from 'react';
import { ChatBot } from '@/components/ChatBot';
import { AdminPanel } from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, MessageCircle, Settings, Database } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chatbot');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UNKLAB Info Bot</h1>
                <p className="text-sm text-gray-600">Sistem Informasi Kampus Universitas Klabat</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'chatbot' ? 'default' : 'outline'}
                onClick={() => setActiveTab('chatbot')}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chatbot</span>
              </Button>
              <Button
                variant={activeTab === 'admin' ? 'default' : 'outline'}
                onClick={() => setActiveTab('admin')}
                className="flex items-center space-x-2"
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
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                Chatbot Interface (T02, T03, T04, T11)
              </h2>
              <p className="text-gray-600 mb-6">
                Interface chatbot untuk memberikan informasi kampus dengan NLP dan estimasi biaya
              </p>
              <ChatBot />
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Admin Panel (T05, T06, T07, T08, T09, T10)
              </h2>
              <p className="text-gray-600 mb-6">
                Panel admin untuk mengelola data kampus, crawling, dan monitoring sistem
              </p>
              <AdminPanel />
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 UNKLAB Info Bot - Prototype System
            </div>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>Version 1.0</span>
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
