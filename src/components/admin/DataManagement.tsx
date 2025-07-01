import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TablesInsert, Tables } from "@/integrations/supabase/types";

const DataManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddingData, setIsAddingData] = useState(false);
  const [editingData, setEditingData] = useState<Tables<"crawled_data"> | null>(
    null
  );
  const [dataList, setDataList] = useState<Tables<"crawled_data">[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    cost: "",
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("crawled_data")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data",
          variant: "destructive",
        });
      } else {
        setDataList(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Add manual data
  const handleAddData = async () => {
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "User tidak valid. Silakan login ulang.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    if (!formData.title || !formData.category || !formData.content) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field wajib",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    let fileUrl = "";
    if (file) {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = `${Date.now()}-${safeFileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("manual-uploads")
        .upload(filePath, file);
      if (uploadError) {
        setLoading(false);
        toast({
          title: "Error",
          description: `Gagal upload file: ${uploadError.message}`,
          variant: "destructive",
        });
        return;
      }
      fileUrl = supabase.storage.from("manual-uploads").getPublicUrl(filePath)
        .data.publicUrl;
    }
    const newData: TablesInsert<"crawled_data"> = {
      title: formData.title,
      category: formData.category,
      content: formData.content,
      url: fileUrl,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source_type: "manual_input",
      status: "success",
    };
    const { error, data } = await supabase
      .from("crawled_data")
      .insert([newData])
      .select();
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: `Gagal menambah data: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Data kampus berhasil ditambahkan",
      });
      setDataList([...(data || []), ...dataList]);
      setFormData({ title: "", category: "", content: "", cost: "" });
      setFile(null);
      setIsAddingData(false);
    }
  };

  // Edit manual data
  const handleEditData = (data: Tables<"crawled_data">) => {
    setEditingData(data);
    setFormData({
      title: data.title,
      category: data.category,
      content: data.content,
      cost: "",
    });
  };

  const handleUpdateData = async () => {
    if (!editingData) return;
    setLoading(true);
    const { error, data } = await supabase
      .from("crawled_data")
      .update({
        title: formData.title,
        category: formData.category,
        content: formData.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingData.id)
      .select();
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Data kampus berhasil diperbarui",
      });
      setDataList(
        dataList.map((item) =>
          item.id === editingData.id
            ? { ...item, ...formData, updated_at: new Date().toISOString() }
            : item
        )
      );
      setEditingData(null);
      setFormData({ title: "", category: "", content: "", cost: "" });
    }
  };

  // Delete data
  const handleDeleteData = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("crawled_data").delete().eq("id", id);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus data",
        variant: "destructive",
      });
    } else {
      toast({ title: "Berhasil", description: "Data kampus berhasil dihapus" });
      setDataList(dataList.filter((item) => item.id !== id));
    }
  };

  const filteredData = dataList.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Program Studi":
        return "bg-purple-100 text-purple-800";
      case "Fasilitas":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Nama program/fasilitas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-category">Kategori *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Program Studi">
                            Program Studi
                          </SelectItem>
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
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Deskripsi lengkap..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-file">
                      Upload File (opsional, pdf/png/jpg/jpeg)
                    </Label>
                    <Input
                      id="add-file"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file && (
                      <div className="text-xs text-gray-700 mt-2">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="max-h-40 rounded border mb-2"
                          />
                        ) : file.type === "application/pdf" ? (
                          <a
                            href={URL.createObjectURL(file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Preview PDF: {file.name}
                          </a>
                        ) : (
                          <span>File: {file.name}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {formData.category === "Program Studi" && (
                    <div className="space-y-2">
                      <Label htmlFor="add-cost">Biaya (Opsional)</Label>
                      <Input
                        id="add-cost"
                        value={formData.cost}
                        onChange={(e) =>
                          setFormData({ ...formData, cost: e.target.value })
                        }
                        placeholder="Rp 0"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={handleAddData}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Simpan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingData(false)}
                    >
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
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
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
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Tidak ada data ditemukan
          </div>
        ) : (
          filteredData.map((item) => (
            <Card
              key={item.id}
              className="border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Badge className={getCategoryBadgeColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge variant="outline">
                        {item.created_by ? "manual" : "crawled"}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{item.content}</p>
                    {item.url &&
                      (item.url.match(/\.pdf$/i) ? (
                        <div className="my-2">
                          <iframe
                            src={item.url}
                            title="Preview PDF"
                            width="100%"
                            height="400px"
                            style={{
                              border: "1px solid #eee",
                              borderRadius: 8,
                            }}
                          />
                          <div className="mt-2">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              Buka file PDF di tab baru
                            </a>
                          </div>
                        </div>
                      ) : item.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <div className="my-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={item.url}
                              alt="Preview Gambar"
                              className="max-h-60 rounded border mb-2 shadow"
                              style={{ maxWidth: "100%" }}
                            />
                          </a>
                          <div>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              Buka gambar di tab baru
                            </a>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          {item.url}
                        </a>
                      ))}
                    <p className="text-xs text-gray-400">
                      Terakhir diupdate:{" "}
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditData(item)}
                      disabled={!item.created_by}
                    >
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
          ))
        )}
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
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
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={4}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleUpdateData}
                className="bg-blue-600 hover:bg-blue-700"
              >
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
