import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "./components/landing/LandingPage";
import { EditorPage } from "./pages/EditorPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { PWAInstallPrompt } from "./components/shared/PWAInstallPrompt";
import { useTheme } from "./hooks/useTheme";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.3,
};

// Animated Routes component
function AnimatedRoutes() {
  const location = useLocation();
  const { theme } = useTheme();

  const handleGetStarted = () => {
    window.location.href = "/editor";
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <LandingPage onGetStarted={handleGetStarted} />
              </motion.div>
            }
          />
          <Route
            path="/editor"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <EditorPage />
              </motion.div>
            }
          />
          <Route
            path="/404"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <NotFoundPage />
              </motion.div>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AnimatedRoutes />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
