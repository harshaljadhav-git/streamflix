import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import VideoPage from "@/pages/video";
import NewReleases from "@/pages/new-releases";
import Videos from "@/pages/videos";
import Categories from "@/pages/categories";
import Channels from "@/pages/channels";
import Featured from "@/pages/featured";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/video/:id" component={VideoPage} />
      <Route path="/new-releases" component={NewReleases} />
      <Route path="/videos" component={Videos} />
      <Route path="/categories" component={Categories} />
      <Route path="/channels" component={Channels} />
      <Route path="/featured" component={Featured} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
