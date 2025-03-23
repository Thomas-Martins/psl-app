import { createContext, ReactNode, useContext, useState } from "react";
import GlobalAlert from "@components/ui/global/GlobalAlert";

type AlertType = "danger" | "success" | "warning" | "default";
type AlertVariant = "solid" | "faded" | "flat" | "bordered";

interface AlertProps {
    title: string;
    type: AlertType;
    hideIcon?: boolean;
    variant?: AlertVariant;
    icon?: ReactNode;
}

interface GlobalAlertContextType {
    setAlert: (props: AlertProps) => void;
}

// Le contexte
const GlobalAlertContext = createContext<GlobalAlertContextType | undefined>(
    undefined,
);

// Hook pour l'utiliser facilement
export const useGlobalAlert = (): GlobalAlertContextType => {
    const context = useContext(GlobalAlertContext);
    if (!context) {
        throw new Error(
            "useGlobalAlert must be used within a GlobalAlertProvider",
        );
    }
    return context;
};

// Le provider
export const GlobalAlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlertState] = useState<AlertProps | null>(null);

    const setAlert = (props: AlertProps) => {
        setAlertState(props);
        setTimeout(() => setAlertState(null), 4000); // Disparition auto
    };

    return (
        <GlobalAlertContext.Provider value={{ setAlert }}>
            {children}
            {alert && (
                <GlobalAlert
                    title={alert.title}
                    type={alert.type}
                    hideIcon={alert.hideIcon ?? false}
                    variant={alert.variant ?? "solid"}
                    icon={alert.icon}
                />
            )}
        </GlobalAlertContext.Provider>
    );
};
