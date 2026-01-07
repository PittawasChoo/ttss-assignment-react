import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { TodoProvider } from "./context/TodoContext.tsx";
import App from "./app/App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoProvider>
      <App />
    </TodoProvider>
  </StrictMode>
);
