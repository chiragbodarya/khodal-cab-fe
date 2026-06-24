import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";
import { applyTheme, getTheme, setupThemeListener } from "./utils/theme";

function App() {
  useEffect(() => {
    // Apply current theme (defaulting to system)
    applyTheme(getTheme());
    // Setup listener for system theme changes
    const cleanup = setupThemeListener();
    return cleanup;
  }, []);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;