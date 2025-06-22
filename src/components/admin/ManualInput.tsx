
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualInputProps {
  onManualSubmit: (title: string, content: string, category: string) => void;
  onFileUpload: (file: File, content: string) => void;
}

const ManualInput = ({ onManualSubmit, onFileUpload }: ManualInputProps) => {
  const { toast } = useToast();
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleManualSubmit = async () => {
    if (!manualTitle || !manualContent || !manualCategory) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }

    onManualSubmit(manualTitle, manualContent, manualCategory);

    toast({
      title: "Data Tersimpan",
      description: "Data manual berhasil ditambahkan dan disimpan"
    });

    // Reset form
    setManualTitle('');
    setManualContent('');
    setManualCategory('');
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
      onFileUpload(file, content);

      toast({
        title: "File Berhasil Diupload",
        description: `File ${file.name} berhasil diupload dan disimpan`
      });
    };

    reader.readAsText(file);
  };

  return (
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
  );
};

export default ManualInput;
