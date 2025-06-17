
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-xl shadow-lg inline-block">
            <div className="h-8 w-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Allow access if user is logged in as regular user OR as admin
  if (!user && !isAdmin) {
    return <AuthForm />;
  }

  return <>{children}</>;
};
