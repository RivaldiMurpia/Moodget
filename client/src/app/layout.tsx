import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Providers from "@/components/providers/Providers";
import { useAuth } from "@/contexts/AuthContext";
import { FullPageSpinner } from "@/components/ui/loadingspinner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

function NavigationBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/dashboard", icon: "chart-line", label: "Dashboard" },
    { path: "/transactions", icon: "exchange-alt", label: "Transactions" },
    { path: "/analytics", icon: "chart-pie", label: "Analytics" },
    { path: "/settings", icon: "cog", label: "Settings" },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 px-4 py-6 hidden md:flex flex-col h-screen sticky top-0">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <i className="fas fa-moon text-indigo-600 text-2xl"></i>
          <h1 className="text-2xl font-bold text-gray-900">EmotionLog</h1>
        </Link>
      </div>

      <ul className="space-y-2 flex-1">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i className={`fas fa-${item.icon} mr-3 w-5`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center mb-4 px-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <i className="fas fa-user text-indigo-600"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-3 w-5"></i>
          Logout
        </button>
      </div>
    </nav>
  );
}

function MobileHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getPageTitle = () => {
    const path = pathname.split("/")[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 md:hidden sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="text-xl font-bold text-gray-900">EmotionLog</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <i className="fas fa-user text-indigo-600"></i>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
      </div>
    </header>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="flex-1">
        <MobileHeader />
        <main className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
