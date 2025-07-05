import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { JsonEditor } from "./components/editor/JsonEditor";
import { Header } from "./components/shared/Header";
import { ToastContainer } from "./components/ui/ToastContainer";
import { OfflineIndicator } from "./components/shared/OfflineIndicator";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { useJsonData } from "./hooks/useJsonData";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { data, setData } = useJsonData();
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
            <Route
              path="/editor"
              element={
                <div className="h-screen flex flex-col">
                  <Header projectName="Untitled Project" />
                  <div className="flex-1 p-4">
                    <JsonEditor data={data} onChange={setData} />
                  </div>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
          <OfflineIndicator />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
