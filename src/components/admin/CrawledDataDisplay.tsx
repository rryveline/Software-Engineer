
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Download, 
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Upload,
  Loader2
} from 'lucide-react';
import { CrawledData } from '@/types/crawling';

interface CrawledDataDisplayProps {
  crawledData: CrawledData[];
  isLoading: boolean;
  onExport: () => void;
}

const CrawledDataDisplay = ({ crawledData, isLoading, onExport }: CrawledDataDisplayProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Data Hasil Crawling ({crawledData.length})</span>
          <Button variant="outline" size="sm" onClick={onExport} disabled={crawledData.length === 0}>
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
  );
};

export default CrawledDataDisplay;
