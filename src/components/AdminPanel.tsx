import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Globe,
  Download,
  Database,
  Activity,
  Users,
  MessageSquare,
  Lock,
  Unlock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CampusData {
  id: string;
  title: string;
  content: string;
  category: "program" | "facility" | "news" | "schedule";
  cost?: number;
  faculty?: string;
  source: "manual" | "crawled";
  lastUpdated: Date;
}

interface ChatLog {
  id: string;
  userQuery: string;
  botResponse: string;
  timestamp: Date;
  responseData?: any;
}

export const AdminPanel = () => {
  const [campusData, setCampusData] = useState<CampusData[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<CampusData | null>(null);
  const [newItem, setNewItem] = useState<Partial<CampusData>>({
    title: "",
    content: "",
    category: "program",
    source: "manual",
  });
  const { toast } = useToast();

  // T01 - Initialize sample data (Database structure simulation)
  useEffect(() => {
    const sampleData: CampusData[] = [
      {
        id: "1",
        title: "Teknik Informatika",
        content:
          "Program studi yang mempelajari pengembangan sistem informasi dan teknologi komputer",
        category: "program",
        cost: 45000000,
        faculty: "Fakultas Teknik",
        source: "manual",
        lastUpdated: new Date(),
      },
      {
        id: "2",
        title: "Perpustakaan Pusat",
        content:
          "Fasilitas perpustakaan dengan koleksi buku lengkap dan akses digital",
        category: "facility",
        source: "manual",
        lastUpdated: new Date(),
      },
      {
        id: "3",
        title: "Pendaftaran Mahasiswa Baru 2024",
        content: "Pendaftaran dibuka mulai Januari hingga Juli 2024",
        category: "news",
        source: "crawled",
        lastUpdated: new Date(),
      },
    ];
    setCampusData(sampleData);

    // T12 - Sample chat logs
    const sampleLogs: ChatLog[] = [
      {
        id: "1",
        userQuery: "Berapa biaya kuliah Teknik Informatika?",
        botResponse: "Biaya kuliah Teknik Informatika adalah Rp 45.000.000",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        userQuery: "Apa saja fasilitas kampus?",
        botResponse:
          "Fasilitas kampus meliputi perpustakaan, laboratorium, asrama, dll.",
        timestamp: new Date(Date.now() - 1800000),
      },
    ];
    setChatLogs(sampleLogs);
  }, []);

  // T07 - Search functionality
  const filteredData = campusData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // T06 - CRUD Operations
  const handleAddItem = () => {
    if (!newItem.title || !newItem.content) {
      toast({
        title: "Error",
        description: "Judul dan konten harus diisi",
        variant: "destructive",
      });
      return;
    }

    const item: CampusData = {
      id: Date.now().toString(),
      title: newItem.title!,
      content: newItem.content!,
      category: newItem.category as any,
      cost: newItem.cost,
      faculty: newItem.faculty,
      source: "manual",
      lastUpdated: new Date(),
    };

    setCampusData((prev) => [...prev, item]);
    setNewItem({
      title: "",
      content: "",
      category: "program",
      source: "manual",
    });
    toast({
      title: "Berhasil",
      description: "Data berhasil ditambahkan",
    });
  };

  const handleEditItem = (item: CampusData) => {
    setEditingItem(item);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    setCampusData((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...editingItem, lastUpdated: new Date() }
          : item
      )
    );
    setEditingItem(null);
    toast({
      title: "Berhasil",
      description: "Data berhasil diperbarui",
    });
  };

  const handleDeleteItem = (id: string) => {
    setCampusData((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Berhasil",
      description: "Data berhasil dihapus",
    });
  };

  // T08, T09 - Simulate crawling functionality
  const handleCrawling = () => {
    toast({
      title: "Crawling Dimulai",
      description: "Mengambil data dari website UNKLAB...",
    });

    // Simulate crawling process
    setTimeout(() => {
      const crawledData: CampusData[] = [
        {
          id: Date.now().toString(),
          title: "Pengumuman Wisuda 2024",
          content: "Wisuda akan dilaksanakan pada bulan November 2024",
          category: "news",
          source: "crawled",
          lastUpdated: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          title: "Jadwal UTS Semester Genap",
          content: "UTS akan dilaksanakan mulai tanggal 15 April 2024",
          category: "schedule",
          source: "crawled",
          lastUpdated: new Date(),
        },
      ];

      setCampusData((prev) => [...prev, ...crawledData]);
      toast({
        title: "Crawling Selesai",
        description: `Berhasil mengambil ${crawledData.length} data baru`,
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Data</p>
              <p className="text-2xl font-bold">{campusData.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Chat Logs</p>
              <p className="text-2xl font-bold">{chatLogs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Crawled Data</p>
              <p className="text-2xl font-bold">
                {campusData.filter((item) => item.source === "crawled").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">Online</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="crawling">Web Crawling</TabsTrigger>
          <TabsTrigger value="logs">Chat Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* T06 - Data Management Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Kelola Data Kampus</h3>
              <Button
                onClick={() => setEditingItem({} as CampusData)}
                className="bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Data
              </Button>
            </div>

            {/* T07 - Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Add/Edit Form */}
            {(editingItem || Object.keys(newItem).length > 2) && (
              <Card className="p-4 mb-4 bg-blue-50">
                <h4 className="font-medium mb-3">
                  {editingItem?.id ? "Edit Data" : "Tambah Data Baru"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Judul</Label>
                    <Input
                      value={editingItem?.title || newItem.title || ""}
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({
                              ...editingItem,
                              title: e.target.value,
                            })
                          : setNewItem({ ...newItem, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={
                        editingItem?.category || newItem.category || "program"
                      }
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({
                              ...editingItem,
                              category: e.target.value as any,
                            })
                          : setNewItem({
                              ...newItem,
                              category: e.target.value as any,
                            })
                      }
                    >
                      <option value="program">Program Studi</option>
                      <option value="facility">Fasilitas</option>
                      <option value="news">Berita</option>
                      <option value="schedule">Jadwal</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Konten</Label>
                    <Textarea
                      value={editingItem?.content || newItem.content || ""}
                      onChange={(e) =>
                        editingItem
                          ? setEditingItem({
                              ...editingItem,
                              content: e.target.value,
                            })
                          : setNewItem({ ...newItem, content: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  {(editingItem?.category === "program" ||
                    newItem.category === "program") && (
                    <>
                      <div>
                        <Label>Biaya (Rp)</Label>
                        <Input
                          type="number"
                          value={editingItem?.cost || newItem.cost || ""}
                          onChange={(e) =>
                            editingItem
                              ? setEditingItem({
                                  ...editingItem,
                                  cost: Number(e.target.value),
                                })
                              : setNewItem({
                                  ...newItem,
                                  cost: Number(e.target.value),
                                })
                          }
                        />
                      </div>
                      <div>
                        <Label>Fakultas</Label>
                        <Input
                          value={editingItem?.faculty || newItem.faculty || ""}
                          onChange={(e) =>
                            editingItem
                              ? setEditingItem({
                                  ...editingItem,
                                  faculty: e.target.value,
                                })
                              : setNewItem({
                                  ...newItem,
                                  faculty: e.target.value,
                                })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={editingItem?.id ? handleUpdateItem : handleAddItem}
                    className="bg-green-600"
                  >
                    {editingItem?.id ? "Update" : "Simpan"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingItem(null);
                      setNewItem({
                        title: "",
                        content: "",
                        category: "program",
                        source: "manual",
                      });
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </Card>
            )}

            {/* Data List */}
            <div className="space-y-3">
              {filteredData.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge
                          variant={
                            item.source === "manual" ? "default" : "secondary"
                          }
                        >
                          {item.source}
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.content}
                      </p>
                      {item.cost && (
                        <p className="text-sm font-medium text-green-600">
                          Biaya: Rp {item.cost.toLocaleString("id-ID")}
                        </p>
                      )}
                      {item.faculty && (
                        <p className="text-sm text-gray-500">{item.faculty}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Terakhir diupdate:{" "}
                        {item.lastUpdated.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* T08, T09 - Web Crawling Tab */}
        <TabsContent value="crawling" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Web Crawling UNKLAB</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Crawling Configuration</h4>
                <div className="space-y-3">
                  <div>
                    <Label>Target URL</Label>
                    <Input value="https://unklab.ac.id" readOnly />
                  </div>
                  <div>
                    <Label>Crawling Schedule</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Setiap 6 jam</option>
                      <option>Setiap hari</option>
                      <option>Manual</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleCrawling}
                    className="w-full bg-orange-600"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Start Crawling
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Crawling Status</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Last Crawl:</span>
                    <span className="text-green-600">2 jam yang lalu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Retrieved:</span>
                    <span>
                      {
                        campusData.filter((item) => item.source === "crawled")
                          .length
                      }{" "}
                      items
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* T12 - Chat Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat Logs</h3>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
            <div className="space-y-3">
              {chatLogs.map((log) => (
                <Card key={log.id} className="p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">
                        User Query
                      </Label>
                      <p className="text-sm font-medium">{log.userQuery}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        Bot Response
                      </Label>
                      <p className="text-sm">{log.botResponse}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {log.timestamp.toLocaleString("id-ID")}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="space-y-4">
              <div>
                <Label>Chatbot Response Language</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>Bahasa Indonesia</option>
                  <option>English</option>
                  <option>Bilingual</option>
                </select>
              </div>
              <div>
                <Label>Auto-crawling Interval</Label>
                <select className="w-full p-2 border rounded-md">
                  <option>6 hours</option>
                  <option>12 hours</option>
                  <option>24 hours</option>
                  <option>Manual only</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="log-enabled" defaultChecked />
                <Label htmlFor="log-enabled">Enable chat logging</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="suggestions-enabled"
                  defaultChecked
                />
                <Label htmlFor="suggestions-enabled">
                  Enable auto-suggestions
                </Label>
              </div>
              <Button className="bg-blue-600">Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
