import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Video as VideoIcon, BarChart3, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import AdminVideoForm from "@/components/admin-video-form";
import AdminVideoTable from "@/components/admin-video-table";
import type { Video } from "@shared/schema";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "ashwatthama" && password === "Harshal-2002-69") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    setUsername("");
    setPassword("");
  };

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalVideos = videos.length;
  const averageViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;

  const topCategory = videos.length > 0 
    ? videos.reduce((acc, video) => {
        acc[video.category] = (acc[video.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const mostPopularCategory = Object.entries(topCategory).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-secondary border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
            <p className="text-gray-400">Enter your credentials to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-background border-gray-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-background border-gray-600 text-white"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Main Admin Dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400">Manage your video content</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-primary px-3 py-1 rounded font-bold text-lg">
              JAV<span className="bg-orange-500 px-2 py-1 ml-1 rounded">STREAM</span>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-secondary border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Videos</CardTitle>
              <VideoIcon className="h-4 w-4 text-purple-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalVideos}</div>
              <p className="text-xs text-gray-400">
                Active content library
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-pink-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-gray-400">
                Across all videos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Average Views</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{averageViews.toLocaleString()}</div>
              <p className="text-xs text-gray-400">
                Per video
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Top Category</CardTitle>
              <Settings className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mostPopularCategory}</div>
              <p className="text-xs text-gray-400">
                Most videos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Video Form */}
        <div className="mb-8">
          <AdminVideoForm />
        </div>

        {/* Video Management Table */}
        <Card className="bg-secondary border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-primary text-xl">Manage Videos</CardTitle>
            <p className="text-gray-400 text-sm">
              View, edit, and delete your video content
            </p>
          </CardHeader>
          <CardContent>
            <AdminVideoTable videos={videos} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}