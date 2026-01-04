import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

interface StudySessionPageProps {
  onNavigate: (page: string) => void;
}

export function StudySessionPage({ onNavigate }: StudySessionPageProps) {
  const flaskUrl = import.meta.env.VITE_FLASK_URL || 'http://localhost:5000';
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);

  useEffect(() => {
    // Listen for messages from Flask iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin is Flask server
      if (event.origin !== flaskUrl.replace(/\/$/, '')) return;
      
      if (event.data === 'session_complete') {
        console.log('✅ Session complete message received from Flask');
        setShowCompleteModal(true);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Mark iframe as ready after a short delay
    const timer = setTimeout(() => setIsIframeReady(true), 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [flaskUrl]);

  const handleContinueToDashboard = () => {
    setShowCompleteModal(false);
    onNavigate('dashboard');
  };

  const handleSkipToDashboard = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-900 overflow-hidden">
      {/* Loading overlay */}
      {!isIframeReady && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900"
        >
          <div className="text-center text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-xl font-medium">Loading Study Session...</p>
          </div>
        </motion.div>
      )}

      {/* Flask iframe - full screen */}
      <iframe
        src={flaskUrl}
        className="absolute inset-0 w-full h-full border-0"
        style={{ width: '100vw', height: '100vh' }}
        title="Study Session"
        allow="camera; microphone; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        onLoad={() => setIsIframeReady(true)}
      />

      {/* Skip to Dashboard button */}
      {isIframeReady && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleSkipToDashboard}
          className="fixed bottom-6 right-6 z-40 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full
                     border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2
                     shadow-lg hover:shadow-xl"
        >
          <span className="font-medium">Skip to Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      )}

      {/* Session Complete Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCompleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 max-w-md mx-4
                         shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowCompleteModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Checkmark animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="w-12 h-12 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path d="M20 6L9 17l-5-5" />
                </motion.svg>
              </motion.div>

              {/* Message */}
              <h2 className="text-3xl font-bold text-white text-center mb-3">
                Session Complete! 🎉
              </h2>
              <p className="text-white/90 text-center mb-8">
                Great focus! Now let's turn your study materials into interactive learning tools.
              </p>

              {/* Continue button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContinueToDashboard}
                className="w-full bg-white text-green-600 font-semibold py-4 px-6 rounded-2xl
                           hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-3
                           shadow-lg"
              >
                <span className="text-lg">Continue to Learning Dashboard</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
