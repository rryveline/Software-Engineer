
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DataManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingData, setIsAddingData] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    cost: ''
  });

  const [campusData] = useState([
    {
      id: '1',
      title: 'Teknik Informatika',
      category: 'Program Studi',
      content: 'Program studi yang mempelajari pengembangan sistem informasi dan teknologi komputer',
      cost: 'Rp 45.000.000',
      faculty: 'Teknik',
      lastUpdated: '19/6/2025, 22.41.23'
    },
    {
      id: '2',
      title: 'Perpustakaan Pusat',
      category: 'Fasilitas',
      content: 'Fasilitas perpustakaan dengan koleksi buku lengkap dan akses digital',
      cost: '',
      faculty: '',
      lastUpdated: '19/6/2025, 22.41.23'
    }
  ]);

  const handleAddData = () => {
    if (!formData.title || !formData.category || !formData.content) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field wajib",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Data kampus berhasil ditambahkan"
    });

    setFormData({ title: '', category: '', content: '', cost: '' });
    setIsAddingData(false);
  };

  const handleEditData = (data: any) => {
    setEditingData(data);
    setFormData({
      title: data.title,
      category: data.category,
      content: data.content,
      cost: data.cost
    });
  };

  const handleUpdateData = () => {
    toast({
      title: "Berhasil",
      description: "Data kampus berhasil diperbarui"
    });
    setEditingData(null);
    setFormData({ title: '', category: '', content: '', cost: '' });
  };

  const handleDeleteData = (id: string) => {
    toast({
      title: "Berhasil",
      description: "Data kampus berhasil dihapus"
    });
  };

  const filteredData = campusData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Program Studi':
        return 'bg-purple-100 text-purple-800';
      case 'Fasilitas':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle>Kelola Data Kampus</CardTitle>
              <CardDescription>Tambah, edit, dan kelola informasi kampus</CardDescription>
            </div>
            <Dialog open={isAddingData} onOpenChange={setIsAddingData}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Tambah Data Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi kampus yang akan ditambahkan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="add-title">Judul *</Label>
                      <Input
                        id="add-title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Nama program/fasilitas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-category">Kategori *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Program Studi">Program Studi</SelectItem>
                          <SelectItem value="Fasilitas">Fasilitas</SelectItem>
                          <SelectItem value="Biaya">Biaya</SelectItem>
                          <SelectItem value="Jadwal">Jadwal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="add-content">Konten *</Label>
                    <Textarea
                      id="add-content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Deskripsi lengkap..."
                      rows={4}
                    />
                  </div>

                  {formData.category === 'Program Studi' && (
                    <div className="space-y-2">
                      <Label htmlFor="add-cost">Biaya (Opsional)</Label>
                      <Input
                        id="add-cost"
                        value={formData.cost}
                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                        placeholder="Rp 0"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddData} className="bg-green-600 hover:bg-green-700">
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingData(false)}>
                      Batal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Program Studi">Program Studi</SelectItem>
                <SelectItem value="Fasilitas">Fasilitas</SelectItem>
                <SelectItem value="Biaya">Biaya</SelectItem>
                <SelectItem value="Jadwal">Jadwal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data List */}
      <div className="space-y-4">
        {filteredData.map((item) => (
          <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <Badge className={getCategoryBadgeColor(item.category)}>
                      {item.category}
                    </Badge>
                    {item.category === 'Program Studi' && (
                      <Badge variant="outline">manual</Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{item.content}</p>
                  {item.cost && (
                    <p className="text-green-600 font-medium">Biaya: {item.cost}</p>
                  )}
                  {item.faculty && (
                    <p className="text-sm text-gray-500">Fakultas {item.faculty}</p>
                  )}
                  <p className="text-xs text-gray-400">Terakhir diupdate: {item.lastUpdated}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditData(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteData(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingData} onOpenChange={() => setEditingData(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Data</DialogTitle>
            <DialogDescription>
              Perbarui informasi data kampus
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Judul</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Program Studi">Program Studi</SelectItem>
                    <SelectItem value="Fasilitas">Fasilitas</SelectItem>
                    <SelectItem value="Biaya">Biaya</SelectItem>
                    <SelectItem value="Jadwal">Jadwal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Konten</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleUpdateData} className="bg-blue-600 hover:bg-blue-700">
                Update
              </Button>
              <Button variant="outline" onClick={() => setEditingData(null)}>
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataManagement;
