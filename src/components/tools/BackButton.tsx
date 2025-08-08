import { Button } from "@heroui/react";
import ArrowLeftIcon from "@components/ui/icons/ArrowLeftIcon.tsx";
import { useNavigate } from "react-router";

export default function BackButton() {
    const navigate = useNavigate();

    const theme = localStorage.getItem("theme") || "light";

    return (
        <Button
            variant="light"
            isIconOnly={true}
            onPress={() => {
                navigate(-1);
            }}
        >
            <ArrowLeftIcon
                size={20}
                color={theme === "dark" ? "white" : "black"}
            />
        </Button>
    );
}
