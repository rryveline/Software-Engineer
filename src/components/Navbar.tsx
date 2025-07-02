import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut, MessageCircle, Settings, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    let timeout;
    try {
      timeout = setTimeout(() => {
        setIsLoggingOut(false);
        alert("Logout terlalu lama, silakan refresh halaman.");
      }, 8000); // 8 detik fallback

      await logout();
      navigate('/');
    } catch (error) {
      alert("Logout gagal. Silakan coba lagi.");
      console.error("Logout error:", error);
    } finally {
      clearTimeout(timeout);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/9fe6cbcd-f7f6-432d-8983-bc8ec7e65bfc.png" 
                alt="UNKLAB Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                UNKLAB Info
              </span>
            </Link>
          </div>

          {/* Navigation Links - Benar-benar Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
              Beranda
            </Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-purple-600 transition-colors font-semibold">
                Admin Panel
              </Link>
            )}
            <Link to="/chatbot" className="text-gray-700 hover:text-purple-600 transition-colors">
              Chatbot
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3 ml-auto">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 hidden sm:block">{user.name}</span>
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : <LogOut className="w-4 h-4" />}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/register">
                  <Button variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Daftar
                  </Button>
                </Link>
                <Link to="/login/user">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                    <User className="w-4 h-4 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/login/admin">
                  <Button variant="outline" size="sm" className="border-gray-200">
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
