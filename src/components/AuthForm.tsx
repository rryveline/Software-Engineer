
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Mail, Lock, User, Shield, UserCheck } from 'lucide-react';

export const AuthForm = () => {
  const [authMode, setAuthMode] = useState<'select' | 'user'>('select');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAsAdmin } = useAuth();
  const { toast } = useToast();

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error Login",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Berhasil",
            description: "Selamat datang di UNKLAB Info Bot!"
          });
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Nama lengkap harus diisi",
            variant: "destructive"
          });
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Error Registrasi",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registrasi Berhasil",
            description: "Silakan cek email Anda untuk verifikasi akun."
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signInAsAdmin(username, password);
      if (error) {
        toast({
          title: "Error Login Admin",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login Admin Berhasil",
          description: "Selamat datang, Administrator!"
        });
      }
    } catch (error) {
      console.error('Admin auth error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setUsername('');
    setIsLogin(true);
  };

  if (authMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
        {/* Background Decorations */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-2xl shadow-2xl">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent mb-4">
              UNKLAB Info Bot
            </h1>
            <p className="text-lg text-purple-600 font-medium">
              Sistem Informasi Kampus Universitas Klabat
            </p>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* User Login Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-purple-200 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-purple-800">
                    User Login
                  </CardTitle>
                  <CardDescription className="text-purple-600 mt-2">
                    Akses informasi kampus
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => {
                    setAuthMode('user');
                    resetForm();
                  }}
                  className="w-full h-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  <UserCheck className="h-6 w-6 mr-3" />
                  Masuk sebagai User
                </Button>
              </CardContent>
            </Card>

            {/* Admin Login Card - Direct Login */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-yellow-200 bg-white/90 backdrop-blur-sm hover:scale-105">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-yellow-800">
                    Admin Login
                  </CardTitle>
                  <CardDescription className="text-yellow-600 mt-2">
                    Kelola sistem dan data
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username" className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4" />
                      Username Admin
                    </Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Username admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border-yellow-200 focus:border-yellow-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="flex items-center gap-2 text-gray-700">
                      <Lock className="h-4 w-4" />
                      Password Admin
                    </Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Password admin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-yellow-200 focus:border-yellow-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
                    disabled={loading}
                  >
                    <Shield className="h-6 w-6 mr-3" />
                    {loading ? 'Memproses...' : 'Login Admin'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User login/register form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

      <Card className="w-full max-w-md shadow-2xl border border-purple-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-xl shadow-lg">
              <UserCheck className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
              {isLogin ? 'User Login' : 'Daftar Akun'}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUserAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Nama Lengkap
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-600" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-600" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-purple-200 focus:border-purple-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
              disabled={loading}
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
              >
                {isLogin 
                  ? 'Belum punya akun? Daftar di sini' 
                  : 'Sudah punya akun? Masuk di sini'
                }
              </button>
              <br />
              <button
                type="button"
                onClick={() => {
                  setAuthMode('select');
                  resetForm();
                }}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Kembali ke pilihan login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
