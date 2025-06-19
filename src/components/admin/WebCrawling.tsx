
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Play, 
  Upload, 
  Download, 
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WebCrawling = () => {
  const { toast } = useToast();
  const [crawlUrl, setCrawlUrl] = useState('https://unklab.ac.id');
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [crawledData] = useState([
    {
      id: '1',
      url: 'https://unklab.ac.id/akademik/program-studi',
      title: 'Program Studi UNKLAB',
      content: 'Daftar lengkap program studi yang tersedia di Universitas Klabat',
      category: 'akademik',
      status: 'success',
      crawledAt: '2024-01-15 10:30:00',
      wordCount: 1250
    },
    {
      id: '2',
      url: 'https://unklab.ac.id/biaya-kuliah',
      title: 'Biaya Kuliah 2024/2025',
      content: 'Informasi lengkap mengenai biaya kuliah per semester',
      category: 'biaya',
      status: 'success',
      crawledAt: '2024-01-15 09:15:00',
      wordCount: 890
    },
    {
      id: '3',
      url: 'https://unklab.ac.id/pendaftaran',
      title: 'Pendaftaran Mahasiswa Baru',
      content: 'Jadwal dan syarat pendaftaran mahasiswa baru',
      category: 'pendaftaran',
      status: 'error',
      crawledAt: '2024-01-15 08:45:00',
      wordCount: 0
    }
  ]);

  const handleStartCrawling = async () => {
    setIsCrawling(true);
    setCrawlProgress(0);

    // Simulate crawling progress
    const interval = setInterval(() => {
      setCrawlProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCrawling(false);
          toast({
            title: "Crawling Selesai",
            description: "Data berhasil diambil dari website UNKLAB"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleManualSubmit = () => {
    if (!manualTitle || !manualContent || !manualCategory) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Data Tersimpan",
      description: "Data manual berhasil ditambahkan"
    });

    // Reset form
    setManualTitle('');
    setManualContent('');
    setManualCategory('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Terupload",
        description: `File ${file.name} berhasil diupload`
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Berhasil</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Gagal</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto Crawling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Crawling Otomatis</span>
          </CardTitle>
          <CardDescription>
            Ambil data otomatis dari website UNKLAB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crawl-url">URL Website</Label>
            <Input
              id="crawl-url"
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
              placeholder="https://unklab.ac.id"
            />
          </div>
          
          {isCrawling && (
            <div className="space-y-2">
              <Label>Progress Crawling</Label>
              <Progress value={crawlProgress} className="w-full" />
              <p className="text-sm text-gray-600">{crawlProgress}% selesai</p>
            </div>
          )}

          <Button 
            onClick={handleStartCrawling}
            disabled={isCrawling}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {isCrawling ? 'Crawling...' : 'Mulai Crawling'}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Input Manual</span>
          </CardTitle>
          <CardDescription>
            Tambah data manual atau upload file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manual-title">Judul</Label>
              <Input
                id="manual-title"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Masukkan judul konten"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-category">Kategori</Label>
              <Select value={manualCategory} onValueChange={setManualCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="akademik">Akademik</SelectItem>
                  <SelectItem value="biaya">Biaya</SelectItem>
                  <SelectItem value="pendaftaran">Pendaftaran</SelectItem>
                  <SelectItem value="fasilitas">Fasilitas</SelectItem>
                  <SelectItem value="berita">Berita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manual-content">Konten</Label>
            <Textarea
              id="manual-content"
              value={manualContent}
              onChange={(e) => setManualContent(e.target.value)}
              placeholder="Masukkan konten lengkap..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File (Opsional)</Label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.doc,.docx,.pdf"
            />
            {uploadedFile && (
              <p className="text-sm text-gray-600">File: {uploadedFile.name}</p>
            )}
          </div>

          <Button 
            onClick={handleManualSubmit}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Simpan Data
          </Button>
        </CardContent>
      </Card>

      {/* Crawled Data Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data Hasil Crawling</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardTitle>
          <CardDescription>
            Daftar data yang berhasil dikumpulkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {crawledData.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{item.title}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-gray-600">{item.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{item.url}</span>
                        <span>•</span>
                        <span>{item.crawledAt}</span>
                        <span>•</span>
                        <span>{item.wordCount} kata</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebCrawling;
