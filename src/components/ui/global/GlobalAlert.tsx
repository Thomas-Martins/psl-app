import { Alert } from "@heroui/react";

// Defines the properties for the GlobalAlert component
interface GlobalDialogProps {
    title: string;
    type: "danger" | "success" | "warning" | "default";
    hideIcon: boolean;
    variant: "solid" | "faded" | "flat" | "bordered";
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
}: GlobalDialogProps) {
    return (
        <Alert
            color={type}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 animate-slide-down w-auto text-white"
            hideIcon={hideIcon}
            title={title}
            variant={variant}
        />
    );
}
