import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { type } = useParams<{ type: 'user' | 'admin' }>();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const isAdmin = type === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Mohon isi email dan password",
        variant: "destructive"
      });
      setLocalLoading(false);
      return;
    }

    const success = await login(formData.email, formData.password, type as 'user' | 'admin');
    setLocalLoading(false);
    if (success) {
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${isAdmin ? 'Administrator' : 'User'}!`
      });
      setTimeout(() => {
        navigate(isAdmin ? '/admin' : '/chatbot');
      }, 100);
    } else {
      toast({
        title: "Login Gagal",
        description: "Email atau password salah. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
              {isAdmin ? (
                <Settings className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {isAdmin ? 'Admin Login' : 'User Login'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isAdmin 
                  ? 'Masuk untuk mengakses panel admin' 
                  : 'Masuk untuk akses fitur chatbot lengkap'
                }
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={isAdmin ? "Masukkan email admin" : "Masukkan email Anda"}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                disabled={isLoading || localLoading}
              >
                {(isLoading || localLoading) ? 'Memproses...' : 'Login'}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {isAdmin ? 'Bukan admin?' : 'Sudah punya akun admin?'}
              </p>
              <Link
                to={isAdmin ? '/login/user' : '/login/admin'}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                {isAdmin ? 'Login sebagai User' : 'Login sebagai Admin'}
              </Link>
            </div>

            {/* Register link for users */}
            {!isAdmin && (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Belum punya akun?
                </p>
                <Link
                  to="/register"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Daftar di sini
                </Link>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
