import { Alert } from "@heroui/react";

interface GlobalDialogProps {
    title: string;
    type: "danger" | "success" | "warning" | "default";
    hideIcon: boolean;
    variant: "solid" | "faded" | "flat" | "bordered";
}
export default function GlobalDialog({
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
