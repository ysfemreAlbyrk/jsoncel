import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { EditorPage } from "./pages/EditorPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  const handleGetStarted = () => {
    window.location.href = "/editor";
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen ${theme}`}>
          <Routes>
            <Route
              path="/"
              element={<LandingPage onGetStarted={handleGetStarted} />}
            />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
