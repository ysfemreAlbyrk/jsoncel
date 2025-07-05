import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LandingPage } from "./components/landing/LandingPage";
import { JsonEditor } from "./components/editor/JsonEditor";
import { useJsonData } from "./hooks/useJsonData";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { data, setData } = useJsonData();
  const { theme } = useTheme();

  const handleGetStarted = () => {
    window.location.href = "/editor";
  };

  return (
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
              <div className="h-screen p-4">
                <JsonEditor data={data} onChange={setData} />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
