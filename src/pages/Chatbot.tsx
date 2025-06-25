
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, MessageCircle, Sparkles, LogIn, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const Chatbot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Halo${user ? ` ${user.name}` : ''}! 👋 Saya adalah chatbot UNKLAB. Anda bisa bertanya tentang program studi, biaya kuliah, jadwal akademik, fasilitas kampus, dan informasi lainnya. Ada yang bisa saya bantu?`,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Info program studi',
        'Biaya kuliah per semester',
        'Jadwal pendaftaran',
        'Fasilitas kampus'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const generateBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('program studi') || message.includes('jurusan') || message.includes('prodi')) {
      return {
        text: 'UNKLAB memiliki berbagai program studi unggulan:\n\n🎓 **Fakultas Teknik:**\n- Teknik Informatika (S1)\n- Sistem Informasi (S1)\n- Teknik Sipil (S1)\n\n🏥 **Fakultas Kesehatan:**\n- Keperawatan (S1)\n- Kesehatan Masyarakat (S1)\n\n💼 **Fakultas Ekonomi:**\n- Manajemen (S1)\n- Akuntansi (S1)\n\nApakah Anda ingin tahu lebih detail tentang salah satu program studi?',
        suggestions: ['Biaya Teknik Informatika', 'Prospek kerja Keperawatan', 'Mata kuliah Manajemen']
      };
    }
    
    if (message.includes('biaya') || message.includes('uang kuliah')) {
      return {
        text: '💰 **Estimasi Biaya Kuliah UNKLAB:**\n\n📋 **Biaya Pendaftaran:** Rp 500.000\n\n💳 **Biaya per Semester:**\n- Teknik Informatika: Rp 8.500.000\n- Sistem Informasi: Rp 8.000.000\n- Keperawatan: Rp 9.000.000\n- Manajemen: Rp 7.500.000\n- Akuntansi: Rp 7.500.000\n\n*Biaya sudah termasuk praktikum dan fasilitas kampus. Tersedia beasiswa untuk mahasiswa berprestasi!',
        suggestions: ['Info beasiswa', 'Cara pembayaran', 'Biaya asrama']
      };
    }
    
    if (message.includes('jadwal') || message.includes('pendaftaran') || message.includes('akademik')) {
      return {
        text: '📅 **Jadwal Akademik 2024/2025:**\n\n🔖 **Pendaftaran Mahasiswa Baru:**\n- Gelombang 1: 15 Januari - 15 Maret 2024\n- Gelombang 2: 16 Maret - 15 Mei 2024\n- Gelombang 3: 16 Mei - 15 Juli 2024\n\n📚 **Semester Ganjil:**\n- Perkuliahan: 28 Agustus - 20 Desember 2024\n- UTS: 14-19 Oktober 2024\n- UAS: 9-20 Desember 2024',
        suggestions: ['Syarat pendaftaran', 'Test masuk', 'Orientasi mahasiswa baru']
      };
    }
    
    if (message.includes('fasilitas') || message.includes('kampus')) {
      return {
        text: '🏢 **Fasilitas Kampus UNKLAB:**\n\n🔬 **Akademik:**\n- Laboratorium Komputer modern\n- Laboratorium Kesehatan lengkap\n- Perpustakaan digital 24/7\n- Ruang kelas ber-AC\n\n🏃 **Olahraga & Rekreasi:**\n- Lapangan basket indoor\n- Lapangan futsal\n- Gym & fitness center\n- Kolam renang\n\n🏠 **Akomodasi:**\n- Asrama putra & putri\n- Kantin & cafeteria\n- Mini market\n- Klinik kesehatan',
        suggestions: ['Info asrama', 'Jam operasional perpustakaan', 'Biaya gym']
      };
    }
    
    if (message.includes('lokasi') || message.includes('alamat') || message.includes('dimana')) {
      return {
        text: '📍 **Lokasi UNKLAB:**\n\nUniversitas Klabat\nJl. Arnold Mononutu, Airmadidi\nKabupaten Minahasa Utara\nSulawesi Utara 95371\n\n🚗 **Akses Transportasi:**\n- 45 menit dari Bandara Sam Ratulangi\n- 30 menit dari Manado\n- Tersedia shuttle bus kampus\n\n📞 **Kontak:**\nTelp: (0431) 891035\nEmail: info@unklab.ac.id',
        suggestions: ['Jadwal shuttle bus', 'Peta kampus', 'Transportasi umum']
      };
    }
    
    return {
      text: 'Maaf, saya belum memahami pertanyaan Anda. Saya bisa membantu dengan informasi tentang:\n\n• Program studi dan jurusan\n• Biaya kuliah dan beasiswa\n• Jadwal akademik\n• Fasilitas kampus\n• Lokasi dan kontak\n\nSilakan ajukan pertanyaan yang lebih spesifik! 😊',
      suggestions: ['Program studi apa saja?', 'Berapa biaya kuliah?', 'Dimana lokasi kampus?']
    };
  };

  const handleSendMessage = async () => {
    if (!user) {
      return; // Akan ditangani oleh UI di bawah
    }
    
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!user) return;
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-violet-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-300/25 rounded-full blur-lg animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-violet-300/15 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-5xl mx-auto p-4 relative z-10 flex flex-col h-screen">
        {/* Enhanced Header */}
        <div className="text-center py-4 mb-4 flex-shrink-0">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/20">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-violet-700 bg-clip-text text-transparent">
                UNKLAB ChatBot
              </h1>
              <p className="text-sm text-gray-600 font-medium">AI Assistant untuk informasi kampus</p>
            </div>
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
        </div>

        {/* Enhanced Chat Container with flexible height */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden flex-1 flex flex-col min-h-0">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Messages with constrained height */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Enhanced Avatar */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-gray-600 to-gray-800' 
                        : 'bg-gradient-to-br from-purple-600 via-purple-700 to-violet-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    {/* Enhanced Message Content */}
                    <div className="flex flex-col space-y-1">
                      <div className={`rounded-2xl px-5 py-4 shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-100'
                      }`}>
                        <p className="whitespace-pre-line text-sm leading-relaxed font-medium">{message.text}</p>
                        
                        {/* Enhanced Suggestions */}
                        {message.suggestions && user && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="bg-white/20 hover:bg-white/30 text-xs px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 border border-white/20 font-medium"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`flex items-center space-x-1 text-xs text-gray-500 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-700 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-5 py-4 shadow-lg border border-gray-100">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area - fixed at bottom */}
            <div className="border-t border-gray-100 p-6 bg-white/80 backdrop-blur-sm flex-shrink-0">
              {!user ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl mb-4">
                    <LogIn className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-700 mb-4 font-medium">Silakan login untuk menggunakan chatbot</p>
                  <Link to="/login/user">
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 rounded-xl">
                      <LogIn className="w-5 h-5 mr-2" />
                      Login untuk Chat
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ketik pertanyaan Anda disini..."
                      className="pr-4 py-3 border-gray-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm focus:shadow-md transition-all duration-200 font-medium"
                      disabled={isTyping}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100 px-6 py-3 rounded-xl"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
