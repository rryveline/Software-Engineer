import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, MessageCircle, Sparkles, LogIn } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">UNKLAB ChatBot</h1>
              <p className="text-sm text-gray-600">AI Assistant untuk informasi kampus</p>
            </div>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>

        {/* Chat Container */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-gray-600 to-gray-700' 
                        : 'bg-gradient-to-br from-purple-600 to-violet-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                      {message.suggestions && user && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="bg-white/20 hover:bg-white/30 text-xs px-3 py-1 rounded-full transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">Silakan login untuk menggunakan chatbot</p>
                  <Link to="/login/user">
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login untuk Chat
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pertanyaan Anda disini..."
                    className="flex-1 border-gray-300 focus:border-purple-500 bg-white"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  >
                    <Send className="w-4 h-4" />
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
