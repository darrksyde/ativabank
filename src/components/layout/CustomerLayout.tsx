import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { Header } from "@/components/layout/Header";
import { useAuthContext } from "@/contexts/AuthContext";

interface CustomerLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function CustomerLayout({ children, title = "Dashboard" }: CustomerLayoutProps) {
  const { currentUser, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <CustomerSidebar />
      
      {/* Main Content */}
      <div className="lg:pl-64 transition-all duration-300 ease-in-out">
        {/* Header */}
        <Header title={`Customer ${title}`} onLogout={handleLogout} />
        
        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50 hidden" id="sidebar-overlay">
        {/* This will be handled by the sidebar component */}
      </div>
    </div>
  );
}