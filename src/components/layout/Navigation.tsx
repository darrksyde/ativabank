import Link from "next/link";
import { useRouter } from "next/router";

interface NavigationProps {
  userType: "customer" | "admin" | "super-admin";
}

export function Navigation({ userType }: NavigationProps) {
  const router = useRouter();

  const getNavigationItems = () => {
    switch (userType) {
      case "customer":
        return [
          { href: "/customer", label: "Dashboard", icon: "🏠" },
          { href: "/customer/transfers", label: "Transfers", icon: "💸" },
          { href: "/customer/card", label: "Card", icon: "💳" },
          { href: "/customer/history", label: "History", icon: "📜" },
        ];
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: "🏠" },
          { href: "/admin", label: "Customers", icon: "👥" },
        ];
      case "super-admin":
        return [
          { href: "/super-admin", label: "Dashboard", icon: "🏠" },
          { href: "/super-admin", label: "Admins", icon: "👨‍💼" },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    router.pathname === item.href
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}