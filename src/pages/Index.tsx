
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import { AdminPanel } from '@/components/AdminPanel';
import { ChatBot } from '@/components/ChatBot';

const Index = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {isAdmin ? 'Admin Panel - UNKLAB Info Bot' : 'UNKLAB Info Bot'}
              </h1>
              <p className="text-sm text-gray-600">
                {isAdmin ? 'Sistem Manajemen Data Kampus' : 'Sistem Informasi Kampus Universitas Klabat'}
              </p>
            </div>
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPanel />
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Selamat Datang di UNKLAB Info Bot
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Dapatkan informasi lengkap tentang Universitas Klabat dengan mudah
              </p>
            </div>
            
            {/* Chat Bot */}
            <ChatBot />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
