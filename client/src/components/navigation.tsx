import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Settings, Home, Star, Folder, PlayCircle, Calendar, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navigation() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home, active: location === "/" },
    { href: "/?category=new", label: "NEW RELEASES", icon: Calendar },
    { href: "/?category=videos", label: "VIDEOS", icon: PlayCircle },
    { href: "/?category=channels", label: "CHANNELS", icon: Grid3X3 },
    { href: "/?category=categories", label: "CATEGORIES", icon: Folder },
    { href: "/?featured=true", label: "FEATURED", icon: Star },
  ];

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-purple-primary px-3 py-1 rounded font-bold text-lg">
              JAV<span className="bg-orange-500 px-2 py-1 ml-1 rounded">STREAM</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 pr-12"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-primary hover:bg-purple-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Admin Toggle */}
          <Link href="/admin">
            <Button className="bg-pink-accent hover:bg-pink-600">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-gray-800">
          <div className="flex items-center space-x-1 py-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={`flex items-center space-x-2 whitespace-nowrap ${
                    item.active
                      ? "bg-purple-primary text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
