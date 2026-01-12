import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import { TodosProvider } from "contexts/TodosContext";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <TodosProvider>
            <App />
        </TodosProvider>

        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 3000,
            }}
        />
    </StrictMode>
);
