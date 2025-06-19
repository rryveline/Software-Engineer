import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Settings, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const [stats] = useState({
    totalUsers: 234,
    totalChats: 1567,
    totalPrograms: 12,
    totalNews: 45
  });

  const [programs] = useState([
    {
      id: '1',
      nama: 'Teknik Informatika',
      fakultas: 'Teknik',
      jenjang: 'S1',
      biayaPerSemester: 8500000,
      isActive: true
    },
    {
      id: '2',
      nama: 'Sistem Informasi',
      fakultas: 'Teknik',
      jenjang: 'S1',
      biayaPerSemester: 8000000,
      isActive: true
    },
    {
      id: '3',
      nama: 'Keperawatan',
      fakultas: 'Kesehatan',
      jenjang: 'S1',
      biayaPerSemester: 9000000,
      isActive: true
    }
  ]);

  const [recentChats] = useState([
    {
      id: '1',
      userQuestion: 'Berapa biaya kuliah Teknik Informatika?',
      botResponse: 'Biaya kuliah Teknik Informatika adalah Rp 8.500.000 per semester...',
      timestamp: '2024-01-15 14:30:00',
      category: 'biaya'
    },
    {
      id: '2',
      userQuestion: 'Kapan pendaftaran mahasiswa baru?',
      botResponse: 'Pendaftaran mahasiswa baru dibuka mulai tanggal 15 Januari...',
      timestamp: '2024-01-15 14:25:00',
      category: 'jadwal'
    }
  ]);

  const handleSaveProgram = () => {
    toast({
      title: "Berhasil",
      description: "Data program studi berhasil disimpan"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Selamat datang, {user?.name}! Kelola informasi kampus UNKLAB dari sini.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100">Chat Sessions</p>
                  <p className="text-3xl font-bold">{stats.totalChats}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Program Studi</p>
                  <p className="text-3xl font-bold">{stats.totalPrograms}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Berita & Info</p>
                  <p className="text-3xl font-bold">{stats.totalNews}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="programs" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Program Studi</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Jadwal</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Berita</span>
            </TabsTrigger>
            <TabsTrigger value="chatlogs" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Program Studi Tab */}
          <TabsContent value="programs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Kelola Program Studi</span>
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Program
                  </Button>
                </CardTitle>
                <CardDescription>
                  Tambah, edit, atau hapus informasi program studi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Cari program studi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {/* Programs Table */}
                <div className="space-y-4">
                  {programs.map((program) => (
                    <Card key={program.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">{program.nama}</h3>
                            <p className="text-sm text-gray-600">
                              {program.fakultas} • {program.jenjang}
                            </p>
                            <p className="text-sm font-medium text-blue-600">
                              Rp {program.biayaPerSemester.toLocaleString('id-ID')} / semester
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={program.isActive ? "default" : "secondary"}>
                              {program.isActive ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Logs Tab */}
          <TabsContent value="chatlogs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Log Percakapan Chatbot</span>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CardTitle>
                <CardDescription>
                  Monitor dan analisis percakapan chatbot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentChats.map((chat) => (
                  <Card key={chat.id} className="border border-gray-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{chat.category}</Badge>
                        <span className="text-sm text-gray-500">{chat.timestamp}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Pertanyaan User:</p>
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {chat.userQuestion}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Jawaban Bot:</p>
                          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                            {chat.botResponse}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would go here */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Jadwal Akademik</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fitur jadwal akademik akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>Kelola Berita & Pengumuman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fitur berita akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Pengaturan sistem akan segera hadir...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
