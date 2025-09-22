import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface NavigationProps {
  userType: "customer" | "admin" | "super-admin";
  currentPage?: string;
}

export function Navigation({ userType, currentPage }: NavigationProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavigationItems = () => {
    switch (userType) {
      case "customer":
        return [
          { href: "/customer", label: "Dashboard", icon: "🏠", description: "Account overview" },
          { href: "/customer/transfers", label: "Transfers", icon: "💸", description: "Send money" },
          { href: "/customer/card", label: "Card", icon: "💳", description: "Fund your card" },
          { href: "/customer/history", label: "History", icon: "📜", description: "Transaction history" },
        ];
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: "🏠", description: "Admin overview" },
          { href: "/admin", label: "Customers", icon: "👥", description: "Manage customers" },
        ];
      case "super-admin":
        return [
          { href: "/super-admin", label: "Dashboard", icon: "🏠", description: "System overview" },
          { href: "/super-admin", label: "Admins", icon: "👨‍💼", description: "Manage admins" },
        ];
      default:
        return [];
    }
  };

  const getBreadcrumbs = () => {
    const path = router.pathname;
    const breadcrumbs: Array<{ label: string; href?: string }> = [];

    if (userType === "customer") {
      breadcrumbs.push({ label: "Customer", href: "/customer" });
      if (path.includes("/transfers")) {
        breadcrumbs.push({ label: "Transfers" });
      } else if (path.includes("/card")) {
        breadcrumbs.push({ label: "Card" });
      } else if (path.includes("/history")) {
        breadcrumbs.push({ label: "History" });
      }
    } else if (userType === "admin") {
      breadcrumbs.push({ label: "Admin", href: "/admin" });
      if (path.includes("/admin/") && router.query.id) {
        breadcrumbs.push({ label: "Customer Management" });
      }
    } else if (userType === "super-admin") {
      breadcrumbs.push({ label: "Super Admin", href: "/super-admin" });
      if (path.includes("/super-admin/") && router.query.id) {
        breadcrumbs.push({ label: "Admin Management" });
      }
    }

    return breadcrumbs;
  };

  const navigationItems = getNavigationItems();
  const breadcrumbs = getBreadcrumbs();
  const isDetailPage = router.query.id;

  const getThemeColors = () => {
    switch (userType) {
      case "customer":
        return {
          active: "border-blue-500 text-blue-600 bg-blue-50",
          hover: "text-gray-700 hover:border-blue-300 hover:bg-blue-50",
          gradient: "from-blue-500 to-cyan-600"
        };
      case "admin":
        return {
          active: "border-green-500 text-green-600 bg-green-50",
          hover: "text-gray-700 hover:border-green-300 hover:bg-green-50",
          gradient: "from-green-500 to-blue-600"
        };
      case "super-admin":
        return {
          active: "border-purple-500 text-purple-600 bg-purple-50",
          hover: "text-gray-700 hover:border-purple-300 hover:bg-purple-50",
          gradient: "from-purple-500 to-indigo-600"
        };
      default:
        return {
          active: "border-indigo-500 text-indigo-600 bg-indigo-50",
          hover: "text-gray-700 hover:border-gray-300",
          gradient: "from-indigo-500 to-purple-600"
        };
    }
  };

  const colors = getThemeColors();

  return (
    <>
      {/* Breadcrumbs */}
      {(breadcrumbs.length > 1 || isDetailPage) && (
        <div className={`bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {breadcrumb.href ? (
                      <Link href={breadcrumb.href} className="text-blue-600 hover:text-blue-800 font-medium">
                        {breadcrumb.label}
                      </Link>
                    ) : (
                      <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`bg-white border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-8">
                {navigationItems.map((item) => {
                  const isActive = router.pathname === item.href || 
                    (item.href !== `/${userType}` && router.pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group inline-flex items-center px-3 py-1 border-b-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? colors.active
                          : `border-transparent text-gray-500 ${colors.hover}`
                      }`}
                      title={item.description}
                    >
                      <span className="text-lg mr-2 transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="relative">
                        {item.label}
                        {isActive && (
                          <span className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} rounded-full`} />
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* User Type Indicator */}
            <div className="flex items-center">
              <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colors.gradient} text-white shadow-sm`}>
                {userType.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
