
import React, { useState, useEffect } from 'react';
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
  FileText,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CrawledData {
  id: string;
  title: string;
  content: string;
  category: string;
  url: string | null;
  source_type: 'auto_crawl' | 'manual_input' | 'file_upload';
  word_count: number | null;
  status: 'success' | 'error' | 'pending';
  created_at: string;
  updated_at: string;
}

const WebCrawling = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [crawlUrl, setCrawlUrl] = useState('https://unklab.ac.id');
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [crawledData, setCrawledData] = useState<CrawledData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch crawled data from Supabase
  const fetchCrawledData = async () => {
    try {
      const { data, error } = await supabase
        .from('crawled_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching crawled data:', error);
        toast({
          title: "Error",
          description: "Gagal mengambil data crawling",
          variant: "destructive"
        });
        return;
      }

      setCrawledData(data || []);
    } catch (error) {
      console.error('Error in fetchCrawledData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrawledData();
  }, []);

  const saveCrawledData = async (
    title: string, 
    content: string, 
    category: string, 
    sourceType: 'auto_crawl' | 'manual_input' | 'file_upload',
    url?: string
  ) => {
    try {
      const { error } = await supabase
        .from('crawled_data')
        .insert({
          title,
          content,
          category,
          source_type: sourceType,
          url: url || null,
          created_by: user?.id || null
        });

      if (error) {
        console.error('Error saving crawled data:', error);
        throw error;
      }

      // Refresh the data list
      await fetchCrawledData();
    } catch (error) {
      console.error('Error in saveCrawledData:', error);
      throw error;
    }
  };

  const handleStartCrawling = async () => {
    if (!crawlUrl) {
      toast({
        title: "Error",
        description: "Mohon masukkan URL yang valid",
        variant: "destructive"
      });
      return;
    }

    setIsCrawling(true);
    setCrawlProgress(0);

    // Simulate crawling progress
    const interval = setInterval(() => {
      setCrawlProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCrawling(false);
          
          // Simulate saving crawled data
          saveCrawledData(
            `Data dari ${crawlUrl}`,
            `Konten yang berhasil di-crawl dari website ${crawlUrl}. Ini adalah contoh data yang dikumpulkan secara otomatis dari halaman web.`,
            'akademik',
            'auto_crawl',
            crawlUrl
          ).then(() => {
            toast({
              title: "Crawling Selesai",
              description: "Data berhasil diambil dan disimpan dari website UNKLAB"
            });
          }).catch(() => {
            toast({
              title: "Error",
              description: "Crawling selesai tetapi gagal menyimpan data",
              variant: "destructive"
            });
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleManualSubmit = async () => {
    if (!manualTitle || !manualContent || !manualCategory) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveCrawledData(
        manualTitle,
        manualContent,
        manualCategory,
        'manual_input'
      );

      toast({
        title: "Data Tersimpan",
        description: "Data manual berhasil ditambahkan dan disimpan"
      });

      // Reset form
      setManualTitle('');
      setManualContent('');
      setManualCategory('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data manual",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['.txt', '.md', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Error",
        description: "Tipe file tidak didukung. Gunakan .txt, .md, .doc, atau .docx",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);

    // Read file content
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      try {
        await saveCrawledData(
          file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          content,
          'dokumen',
          'file_upload'
        );

        toast({
          title: "File Berhasil Diupload",
          description: `File ${file.name} berhasil diupload dan disimpan`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menyimpan file yang diupload",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
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

  const getSourceTypeBadge = (sourceType: string) => {
    switch (sourceType) {
      case 'auto_crawl':
        return <Badge variant="outline" className="text-blue-600"><Globe className="w-3 h-3 mr-1" />Auto Crawl</Badge>;
      case 'manual_input':
        return <Badge variant="outline" className="text-green-600"><FileText className="w-3 h-3 mr-1" />Manual</Badge>;
      case 'file_upload':
        return <Badge variant="outline" className="text-purple-600"><Upload className="w-3 h-3 mr-1" />File Upload</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const exportData = () => {
    const csvContent = crawledData.map(item => 
      `"${item.title}","${item.category}","${item.source_type}","${item.status}","${item.word_count}","${formatDate(item.created_at)}"`
    ).join('\n');
    
    const csvHeader = 'Judul,Kategori,Sumber,Status,Jumlah Kata,Tanggal\n';
    const csv = csvHeader + csvContent;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crawled_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
            {isCrawling ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Crawling...</>
            ) : (
              <><Play className="w-4 h-4 mr-2" />Mulai Crawling</>
            )}
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
                  <SelectItem value="dokumen">Dokumen</SelectItem>
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
              accept=".txt,.md,.doc,.docx"
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
            <span>Data Hasil Crawling ({crawledData.length})</span>
            <Button variant="outline" size="sm" onClick={exportData} disabled={crawledData.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            Daftar data yang berhasil dikumpulkan dari Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Memuat data...</span>
            </div>
          ) : crawledData.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum Ada Data</h3>
              <p className="text-gray-500">
                Mulai crawling atau tambah data manual untuk melihat hasilnya di sini
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {crawledData.map((item) => (
                <Card key={item.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{item.title}</h3>
                          {getStatusBadge(item.status)}
                          {getSourceTypeBadge(item.source_type)}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.content.substring(0, 200)}
                          {item.content.length > 200 && '...'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="capitalize">{item.category}</span>
                          <span>•</span>
                          {item.url && (
                            <>
                              <span className="truncate max-w-xs">{item.url}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatDate(item.created_at)}</span>
                          <span>•</span>
                          <span>{item.word_count || 0} kata</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebCrawling;
