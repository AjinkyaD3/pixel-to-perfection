import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Events from "./pages/Events";
import Highlights from "./pages/Highlights";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import JoinCommunity from "./pages/JoinCommunity";
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AllEvents from './pages/AllEvents';
import Gallery from './pages/Gallery';
import SplashScreen from './components/SplashScreen';
import CustomCursor from './components/CustomCursor';
import ThreeDBackground from './components/ThreeDBackground';
import MemberLogin from './pages/member/Login';
import MemberDashboard from './pages/member/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Add a DashboardRedirect component that redirects based on role
const DashboardRedirect = () => {
  // Get current user from auth service
  const user = JSON.parse(localStorage.getItem("pixel_to_perfection_user") || "{}");
  const role = user?.role;

  // Redirect based on role
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (role === "member" || role === "committee") {
    return <Navigate to="/member/dashboard" replace />;
  } else if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  } else {
    // Default fallback - if role not recognized
    return <Navigate to="/student/dashboard" replace />;
  }
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <ThreeDBackground />
        {showSplash ? (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        ) : (
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/highlights" element={<Highlights />} />
              <Route path="/about" element={<About />} />
              <Route path="/join" element={<JoinCommunity />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/member/login" element={<MemberLogin />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Smart Dashboard Route - redirects based on user role */}
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Member Routes */}
              <Route 
                path="/member/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['member', 'committee']}>
                    <MemberDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
