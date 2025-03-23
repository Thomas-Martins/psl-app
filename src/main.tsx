import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./styles/main.css";
import "./core/i18n/i18n.ts";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
import { ConfirmationModalProvider } from "@components/ui/global/GlobalConfirmationModal.tsx";
import { GlobalAlertProvider } from "@/contexts/GlobalAlertContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <HeroUIProvider>
                    <GlobalAlertProvider>
                        <ConfirmationModalProvider>
                            <App />
                        </ConfirmationModalProvider>
                    </GlobalAlertProvider>
                </HeroUIProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>,
);
