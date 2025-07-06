import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { GlobalErrorBoundary } from "./components/shared/GlobalErrorBoundary";
import { PWAInstallPrompt } from "./components/shared/PWAInstallPrompt";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { useTheme } from "./hooks/useTheme";

// Lazy load components for code splitting
const LandingPage = React.lazy(() =>
  import("./components/landing/LandingPage").then((module) => ({
    default: module.LandingPage,
  }))
);
const EditorPage = React.lazy(() =>
  import("./pages/EditorPage").then((module) => ({
    default: module.EditorPage,
  }))
);
const NotFoundPage = React.lazy(() =>
  import("./pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
);

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
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
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
        </Suspense>
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <ErrorBoundary>
        <Router>
          <AnimatedRoutes />
        </Router>
      </ErrorBoundary>
    </GlobalErrorBoundary>
  );
}

export default App;
