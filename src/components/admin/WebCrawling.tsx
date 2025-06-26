import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CrawledData } from '@/types/crawling';
import AutoCrawling from './AutoCrawling';
import ManualInput from './ManualInput';
import CrawledDataDisplay from './CrawledDataDisplay';

const WebCrawling = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
      console.log('Saving crawled data with user:', user);
      
      // Set created_by to null for admin users without Supabase Auth ID
      const created_by = user?.id && user.email ? user.id : null;
      
      console.log('Using created_by:', created_by);

      const insertData = {
        title,
        content,
        category,
        source_type: sourceType,
        status: 'success', // Always set status to success for successful crawls
        url: url || null,
        created_by // This will be null for admin users without Supabase Auth
      };

      console.log('Insert data:', insertData);

      const { error } = await supabase
        .from('crawled_data')
        .insert(insertData);

      if (error) {
        console.error('Error saving crawled data:', error);
        throw error;
      }

      console.log('Data saved successfully');
      await fetchCrawledData();
      
      toast({
        title: "Berhasil",
        description: "Data berhasil disimpan",
        variant: "default"
      });
    } catch (error) {
      console.error('Error in saveCrawledData:', error);
      throw error;
    }
  };

  const handleCrawlComplete = async (title: string, content: string, category: string, url: string) => {
    try {
      await saveCrawledData(title, content, category, 'auto_crawl', url);
      toast({
        title: "Crawling Selesai",
        description: "Data berhasil diambil dan disimpan dari website",
        variant: "default"
      });
    } catch (error) {
      console.error('Error in handleCrawlComplete:', error);
      toast({
        title: "Error",
        description: "Crawling selesai tetapi gagal menyimpan data",
        variant: "destructive"
      });
    }
  };

  const handleManualSubmit = async (title: string, content: string, category: string) => {
    try {
      await saveCrawledData(title, content, category, 'manual_input');
      toast({
        title: "Berhasil",
        description: "Data manual berhasil disimpan",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving manual data:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data manual",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File, content: string) => {
    try {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
      await saveCrawledData(
        fileName,
        content,
        'dokumen',
        'file_upload'
      );
      toast({
        title: "Berhasil",
        description: `File ${file.name} berhasil diupload dan disimpan`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving uploaded file:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan file yang diupload",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    const csvContent = crawledData.map(item => 
      `"${item.title}","${item.category}","${item.source_type}","${item.status}","${item.word_count}","${new Date(item.created_at).toLocaleString('id-ID')}"`
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

  // Handler untuk crawling backend
  const handleStartCrawlingBackend = async () => {
    try {
      const res = await fetch('http://localhost:4000/start-crawling', { method: 'POST' });
      const data = await res.json();
      toast({
        title: 'Backend Crawling',
        description: data.message,
        variant: 'default'
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Gagal memulai crawling backend',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleStartCrawlingBackend}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition mb-2"
      >
        Start Crawling (Backend)
      </button>
      <AutoCrawling onCrawlComplete={handleCrawlComplete} />
      <ManualInput 
        onManualSubmit={handleManualSubmit}
        onFileUpload={handleFileUpload}
      />
      <CrawledDataDisplay 
        crawledData={crawledData}
        isLoading={isLoading}
        onExport={exportData}
      />
    </div>
  );
};

export default WebCrawling;
