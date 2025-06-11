
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Clock, DollarSign, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
                  `Durasi: ${p.duration}\n` +
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

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = processMessage(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // T12 - Log chat for admin review
      console.log('Chat Log:', {
        userQuery: inputValue,
        botResponse: botResponse.text,
        timestamp: new Date(),
        responseData: botResponse.data
      });
    }, 1500);
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">UNKLAB Info Bot</h3>
            <p className="text-primary-foreground/80 text-sm">Siap membantu 24/7</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg' 
                : 'bg-white border rounded-r-lg rounded-tl-lg shadow-sm'
            } p-3`}>
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className={`text-sm ${message.sender === 'user' ? 'text-primary-foreground' : 'text-gray-800'}`}>
                    {formatMessage(message.text)}
                  </div>
                  <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    <Clock className="h-3 w-3 inline mr-1" />
                    {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <User className="h-4 w-4 mt-1 text-primary-foreground/80 flex-shrink-0" />
                )}
              </div>
              
              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-gray-500 font-medium">Pertanyaan yang mungkin Anda maksud:</div>
                  <div className="flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 text-xs"
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
                <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2 text-primary">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Detail Biaya</span>
                  </div>
                  <div className="mt-2 text-sm text-primary/80">
                    <div>Program: {message.data.program.name}</div>
                    <div>Total: Rp {message.data.program.cost.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-r-lg rounded-tl-lg shadow-sm p-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tanyakan tentang UNKLAB..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Ketik pertanyaan Anda atau klik salah satu saran di atas
        </div>
      </div>
    </div>
  );
};
