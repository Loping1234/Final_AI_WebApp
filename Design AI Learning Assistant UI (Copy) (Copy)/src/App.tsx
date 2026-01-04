import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { FloatingNav } from "./components/FloatingNav";
import { HomePage } from "./components/HomePage";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";
import { StudySessionPage } from "./components/StudySessionPage";
import { AuthDebugger } from "./components/AuthDebugger";
import { RateLimitIndicator } from "./components/RateLimitIndicator";
import { supabase } from "./lib/supabase";
import { User } from "@supabase/supabase-js";
import { Toaster } from "./components/ui/sonner";
import { Loader2 } from "lucide-react";

type Page = "home" | "auth" | "study-session" | "dashboard" | "profile";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      // Check URL hash for page navigation
      const hash = window.location.hash.slice(1); // Remove the #
      if (hash && ['home', 'auth', 'study-session', 'dashboard', 'profile'].includes(hash)) {
        // If hash is explicitly set (e.g., from Flask redirect), use it
        setCurrentPage(hash as Page);
      } else if (session?.user) {
        // ✅ UNIFIED WORKFLOW: Redirect to study session first after login
        setCurrentPage("study-session");
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      // Check if user is coming back from Flask (hash = dashboard)
      const hash = window.location.hash.slice(1);
      
      if (session?.user && _event === "SIGNED_IN" && hash !== "dashboard" && hash !== "profile" && hash !== "study-session") {
        // ✅ UNIFIED WORKFLOW: After sign in, go to study session first
        setCurrentPage("study-session");
        window.location.hash = "study-session";
      } else if (!session?.user && (currentPage === "dashboard" || currentPage === "study-session")) {
        setCurrentPage("home");
        window.location.hash = "";
      }
    });

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['home', 'auth', 'study-session', 'dashboard', 'profile'].includes(hash)) {
        setCurrentPage(hash as Page);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleNavigate = (page: string) => {
    // If logging out, sign out from Supabase
    if (page === "home" && currentPage === "dashboard") {
      handleLogout();
      return;
    }
    setCurrentPage(page as Page);
    window.location.hash = page;
  };

  const handleAuthSuccess = () => {
    // ✅ UNIFIED WORKFLOW: After successful auth, redirect to study session first
    setCurrentPage("study-session");
    window.location.hash = "study-session";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage("home");
    window.location.hash = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-x-hidden ${currentPage === "study-session" ? "h-full" : "min-h-screen"}`}>
      {/* Hide animated background on study session page */}
      {currentPage !== "study-session" && <AnimatedBackground />}
      <Toaster position="top-right" />
      <AuthDebugger />
      <RateLimitIndicator />

      {/* Navigation */}
      {currentPage !== "auth" && currentPage !== "study-session" && (
        <FloatingNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          showDashboardItems={user !== null}
        />
      )}

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={currentPage === "study-session" ? "h-full" : ""}
        >
          {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}
          {currentPage === "auth" && (
            <AuthPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />
          )}
          {currentPage === "study-session" && <StudySessionPage onNavigate={handleNavigate} />}
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "profile" && <ProfilePage onNavigate={handleNavigate} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
