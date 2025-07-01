import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Shield } from "lucide-react";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role === "admin";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout Berhasil",
        description: isAdmin
          ? "Admin berhasil keluar dari sistem"
          : "Anda telah berhasil keluar dari sistem",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout, silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div
        className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${
          isAdmin
            ? "bg-red-50 border-red-200"
            : "bg-purple-50 border-purple-200"
        }`}
      >
        {isAdmin ? (
          <Shield className="h-4 w-4 text-red-600" />
        ) : (
          <User className="h-4 w-4 text-purple-600" />
        )}
        <span
          className={`text-sm font-medium ${
            isAdmin ? "text-red-700" : "text-purple-700"
          }`}
        >
          {isAdmin ? "Admin" : user?.email}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Keluar</span>
      </Button>
    </div>
  );
};
