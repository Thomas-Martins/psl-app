import { Alert } from "@heroui/react";
import { ReactNode } from "react";
import CheckIcon from "@components/ui/icons/CheckIcon.tsx";
import DangerIcon from "@components/ui/icons/DangerIcon.tsx";

// Defines the properties for the GlobalAlert component
interface GlobalDialogProps {
    title: string;
    type: "danger" | "success" | "warning" | "default" | "primary";
    hideIcon: boolean;
    variant: "solid" | "faded" | "flat" | "bordered";
    icon?: ReactNode;
}

/**
 * GlobalAlert displays a styled alert at the top center of the screen.
 * It leverages the Alert component from @heroui/react with predefined positioning and animation.
 */
export default function GlobalAlert({
    title,
    type,
    hideIcon,
    variant = "solid",
    icon,
}: GlobalDialogProps) {
    const getDefaultIcon = () => {
        if (type === "success") return <CheckIcon color="white" />;
        if (type === "danger") return <DangerIcon color="white" />;
        return null;
    };

    return (
        <Alert
            color={type}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down shadow-lg w-fit text-white"
            hideIcon={hideIcon}
            hideIconWrapper={true}
            title={title}
            variant={variant}
            icon={icon ?? getDefaultIcon()}
        />
    );
}
