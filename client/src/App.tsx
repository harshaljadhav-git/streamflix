import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
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

function AgeWarningModal() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Optionally, check localStorage to remember user's choice
    const accepted = localStorage.getItem("ageAccepted");
    if (accepted === "yes") setShow(false);
  }, []);

  const handleYes = () => {
    localStorage.setItem("ageAccepted", "yes");
    setShow(false);
  };

  const handleNo = () => {
    window.location.href = "https://www.google.com"; // Redirect or show a message
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        <h2>Are you 18 or older?</h2>
        <p>This site is for 18+ only. Please confirm your age.</p>
        <button onClick={handleYes} style={{ margin: 8, padding: "8px 16px" }}>
          Yes
        </button>
        <button onClick={handleNo} style={{ margin: 8, padding: "8px 16px" }}>
          No
        </button>
      </div>
    </div>
  );
}

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
      <AgeWarningModal />
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
