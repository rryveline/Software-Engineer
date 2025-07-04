import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Globe, Play, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutoCrawlingProps {
  onCrawlComplete: (title: string, content: string, category: string, url: string) => void;
}

const AutoCrawling = ({ onCrawlComplete }: AutoCrawlingProps) => {
  const { toast } = useToast();
  const [crawlUrl, setCrawlUrl] = useState('https://unklab.ac.id');
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [isCrawling, setIsCrawling] = useState(false);

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

    try {
      const res = await fetch("http://localhost:4000/start-crawling-demo", {
        method: "POST",
      });
      const data = await res.json();
      toast({
        title: "Crawling Demo",
        description: data.message,
        variant: "default",
      });
      // Tunggu beberapa detik agar backend selesai, lalu refresh data
      setTimeout(() => {
        setIsCrawling(false);
        setCrawlProgress(100);
        onCrawlComplete(
          `Demo crawling selesai`,
          `Crawling demo (5 halaman) telah selesai. Silakan cek data hasil crawling.`,
          'demo',
          crawlUrl
        );
      }, 3000);
    } catch (err) {
      setIsCrawling(false);
      toast({
        title: "Error",
        description: "Gagal memulai crawling demo",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};

export default AutoCrawling;
