import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  MessageSquare,
  Globe,
  Settings,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DataManagement from "@/components/admin/DataManagement";
import WebCrawling from "@/components/admin/WebCrawling";
import { supabase } from "../integrations/supabase/client";

const AdminDashboard = () => {
  const { user } = useAuth();

  // State untuk data statistik
  const [totalData, setTotalData] = useState(0);
  const [crawledData, setCrawledData] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("crawled_data")
        .select("id, created_by");
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
      if (data) {
        setTotalData(data.length);
        setCrawledData(data.filter((item) => item.created_by === null).length);
      }
    };
    fetchData();
  }, []);

  // Stats data
  const stats = [
    {
      title: "Total Data",
      value: totalData,
      icon: Database,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Chat Logs",
      value: "2", // Ganti dengan data dinamis jika sudah ada
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Crawled Data",
      value: crawledData,
      icon: Globe,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Status",
      value: "Online",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Selamat datang, {user?.name}! Kelola informasi kampus UNKLAB dari
            sini.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.color} text-white border-0 shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="data-management" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger
              value="data-management"
              className="flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Data Management</span>
            </TabsTrigger>
            <TabsTrigger
              value="web-crawling"
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Web Crawling</span>
            </TabsTrigger>
            <TabsTrigger
              value="chat-logs"
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Logs</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data-management">
            <DataManagement />
          </TabsContent>

          <TabsContent value="web-crawling">
            <WebCrawling />
          </TabsContent>

          <TabsContent value="chat-logs">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Chat Logs
                  </h3>
                  <p className="text-gray-500">
                    Fitur monitoring chat logs akan segera tersedia
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    System Settings
                  </h3>
                  <p className="text-gray-500">
                    Pengaturan sistem akan segera tersedia
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
