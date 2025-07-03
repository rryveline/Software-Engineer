import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Clock, DollarSign, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface ProgramData {
  name: string;
  faculty: string;
  duration: string;
  cost: number;
  description: string;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sample data (T01 - Database Structure)
  const programs: ProgramData[] = [
    {
      name: "Teknik Informatika",
      faculty: "Fakultas Teknik",
      duration: "4 tahun (8 semester)",
      cost: 45000000,
      description: "Program studi yang mempelajari pengembangan sistem informasi dan teknologi komputer"
    },
    {
      name: "Manajemen",
      faculty: "Fakultas Ekonomi",
      duration: "4 tahun (8 semester)",
      cost: 38000000,
      description: "Program studi yang mempelajari pengelolaan organisasi dan bisnis"
    },
    {
      name: "Keperawatan",
      faculty: "Fakultas Kesehatan",
      duration: "4 tahun (8 semester)",
      cost: 52000000,
      description: "Program studi yang mempelajari pelayanan kesehatan dan keperawatan"
    },
    {
      name: "Pendidikan Bahasa Inggris",
      faculty: "Fakultas Pendidikan",
      duration: "4 tahun (8 semester)",
      cost: 35000000,
      description: "Program studi yang mempelajari pendidikan dan pengajaran bahasa Inggris"
    }
  ];

  const campusInfo = {
    location: "Airmadidi, Minahasa Utara, Sulawesi Utara",
    established: "1965",
    type: "Universitas Swasta Advent",
    accreditation: "B (Baik)",
    facilities: ["Perpustakaan", "Laboratorium Komputer", "Asrama", "Klinik", "Aula", "Lapangan Olahraga"]
  };

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: 'Selamat datang di UNKLAB Info Bot! 👋\n\nSaya bisa membantu Anda mendapatkan informasi tentang:\n• Program studi dan biaya kuliah\n• Fasilitas kampus\n• Jadwal pendaftaran\n• Informasi umum UNKLAB\n\nSilakan tanyakan apa yang ingin Anda ketahui!',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        'Berapa biaya kuliah Teknik Informatika?',
        'Apa saja fasilitas kampus?',
        'Dimana lokasi UNKLAB?',
        'Program studi apa saja yang tersedia?'
      ]
    };
    setMessages([welcomeMessage]);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fungsi untuk mencari data relevan di Supabase
  async function searchSupabase(query) {
    // Simple search: cari di judul dan konten
    const { data, error } = await supabase
      .from('crawled_data')
      .select('title, content, url')
      .ilike('content', `%${query}%`)
      .limit(3);
    if (error) return [];
    return data || [];
  }

  // Fungsi untuk tanya ke OpenAI dengan context data
  async function getOpenAIAnswerFromInternet(userMessage: string) {
    const prompt = `Pertanyaan user: ${userMessage}\n\nJawab dengan jelas, akurat, dan lengkap dalam bahasa Indonesia. Jangan sebutkan bahwa Anda AI atau dari internet.`;
  
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Kamu adalah asisten cerdas yang menjawab semua pertanyaan umum dalam bahasa Indonesia secara informatif dan sopan.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 512
      })
    });
  
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Maaf, saya tidak dapat menemukan jawaban saat ini.';
  }
  

  // Fungsi untuk mendapatkan keyword pencarian dari OpenAI (NLP)
  async function getSearchKeywordsFromOpenAI(userMessage) {
    const prompt = `Ambilkan 3 kata kunci pencarian (dalam bahasa Indonesia) yang paling relevan dari pertanyaan berikut, pisahkan dengan koma, tanpa penjelasan lain. Jika pertanyaan tidak jelas, kembalikan pertanyaan aslinya saja.\n\nPertanyaan: ${userMessage}\nKata kunci:`;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Kamu adalah asisten yang membantu mencari kata kunci pencarian dari pertanyaan user.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 32
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || userMessage;
  }

  // T03 - Basic NLP Logic
  const processMessage = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let data: any = null;

    // T11 - Cost estimation by program
    if (message.includes('biaya') || message.includes('uang kuliah') || message.includes('spp')) {
      const program = programs.find(p => 
        message.includes(p.name.toLowerCase()) || 
        message.includes(p.name.toLowerCase().replace(' ', ''))
      );
      
      if (program) {
        response = `💰 **Estimasi Biaya ${program.name}**\n\n` +
                  `• Program: ${program.name}\n` +
                  `• Fakultas: ${program.faculty}\n` +
                  `• Durasi: ${program.duration}\n` +
                  `• Estimasi Total Biaya: Rp ${program.cost.toLocaleString('id-ID')}\n\n` +
                  `*Biaya dapat berubah sesuai kebijakan universitas`;
        data = { type: 'cost', program };
        suggestions = [
          'Info fasilitas kampus',
          'Program studi lainnya',
          'Cara pendaftaran'
        ];
      } else {
        response = `💰 **Informasi Biaya Kuliah UNKLAB**\n\n` +
                  programs.map(p => 
                    `• ${p.name}: Rp ${p.cost.toLocaleString('id-ID')}`
                  ).join('\n') +
                  `\n\n*Untuk informasi lebih detail, sebutkan nama program studi yang diminati.`;
        suggestions = programs.map(p => `Biaya ${p.name}`);
      }
    }
    // Program information
    else if (message.includes('program') || message.includes('jurusan') || message.includes('fakultas')) {
      response = `📚 **Program Studi di UNKLAB**\n\n` +
                programs.map(p => 
                  `**${p.name}**\n` +
                  `Fakultas: ${p.faculty}\n` +
                  `Durasi: ${p.duration}\n` +y
                  `${p.description}\n`
                ).join('\n') +
                `\nUntuk informasi biaya, tanyakan "biaya [nama program]"`;
      suggestions = [
        'Biaya Teknik Informatika',
        'Fasilitas kampus',
        'Lokasi UNKLAB'
      ];
    }
    // Campus facilities
    else if (message.includes('fasilitas') || message.includes('gedung') || message.includes('lab')) {
      response = `🏢 **Fasilitas Kampus UNKLAB**\n\n` +
                campusInfo.facilities.map(f => `• ${f}`).join('\n') +
                `\n\nSemua fasilitas dirancang untuk mendukung proses pembelajaran yang optimal.`;
      suggestions = [
        'Lokasi kampus',
        'Program studi tersedia',
        'Biaya kuliah'
      ];
    }
    // Location and general info
    else if (message.includes('lokasi') || message.includes('alamat') || message.includes('dimana')) {
      response = `📍 **Informasi Lokasi UNKLAB**\n\n` +
                `• Alamat: ${campusInfo.location}\n` +
                `• Didirikan: ${campusInfo.established}\n` +
                `• Jenis: ${campusInfo.type}\n` +
                `• Akreditasi: ${campusInfo.accreditation}`;
      suggestions = [
        'Fasilitas kampus',
        'Program studi',
        'Biaya kuliah'
      ];
    }
    // Default response
    else {
      response = `Maaf, saya belum memahami pertanyaan Anda. 🤔\n\n` +
                `Saya bisa membantu dengan informasi tentang:\n` +
                `• Biaya kuliah per program studi\n` +
                `• Program studi yang tersedia\n` +
                `• Fasilitas kampus\n` +
                `• Lokasi dan informasi umum\n\n` +
                `Silakan coba pertanyaan lain!`;
      suggestions = [
        'Biaya kuliah Teknik Informatika',
        'Program studi apa saja?',
        'Fasilitas kampus',
        'Lokasi UNKLAB'
      ];
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      suggestions,
      data
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
  
    try {
      const searchKeywords = await getSearchKeywordsFromOpenAI(inputValue);
      const relevantData = await searchSupabase(searchKeywords);
  
      let botResponse: Message;
  
      if (relevantData.length > 0) {
        // Jika ada data relevan dari Supabase
        const answer = await getOpenAIAnswer(inputValue, relevantData);
        botResponse = {
          id: Date.now().toString(),
          text: answer,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: [],
          data: null
        };
      } else {
        // Jika tidak ada data → jawab dari "internet"
        const internetAnswer = await getOpenAIAnswerFromInternet(inputValue);
        botResponse = {
          id: Date.now().toString(),
          text: internetAnswer,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: [],
          data: null
        };
      }
  
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'Terjadi kesalahan saat memproses pesan. Silakan coba lagi nanti.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className={line.startsWith('**') && line.endsWith('**') ? 'font-semibold' : ''}>
        {line.replace(/\*\*/g, '')}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">UNKLAB Info Bot</h3>
              <Sparkles className="h-4 w-4 text-purple-200" />
            </div>
            <p className="text-purple-100 text-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Siap membantu 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-purple-50/30 to-white">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              message.sender === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-l-2xl rounded-tr-2xl shadow-lg' 
                : 'bg-white border border-purple-100 rounded-r-2xl rounded-tl-2xl shadow-lg'
            } p-4`}>
              <div className="flex items-start space-x-3">
                {message.sender === 'bot' && (
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Bot className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  </div>
                )}
                <div className="flex-1">
                  <div className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {formatMessage(message.text)}
                  </div>
                  <div className={`text-xs mt-2 flex items-center gap-1 ${message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                    <Clock className="h-3 w-3" />
                    {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="bg-white/20 p-2 rounded-full">
                    <User className="h-4 w-4 text-white flex-shrink-0" />
                  </div>
                )}
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Pertanyaan yang mungkin Anda maksud:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50 hover:border-purple-300 text-xs transition-all duration-200 hover:scale-105"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Data Display */}
              {message.data?.type === 'cost' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2 text-purple-700 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">Detail Biaya</span>
                  </div>
                  <div className="text-sm text-purple-600 space-y-1">
                    <div>Program: {message.data.program.name}</div>
                    <div className="font-semibold">Total: Rp {message.data.program.cost.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-purple-100 rounded-r-2xl rounded-tl-2xl shadow-lg p-4 max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-purple-100 bg-white">
        <div className="flex space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tanyakan tentang UNKLAB..."
            className="flex-1 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3 text-purple-400" />
          Ketik pertanyaan Anda atau klik salah satu saran di atas
        </div>
      </div>
    </div>
  );
};
