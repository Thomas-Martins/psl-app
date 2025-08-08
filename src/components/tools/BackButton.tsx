import { Button } from "@heroui/react";
import ArrowLeftIcon from "@components/ui/icons/ArrowLeftIcon.tsx";
import { useNavigate } from "react-router";
import { useIsDark } from "@/utils/hook/useIsDark";

export default function BackButton() {
    const navigate = useNavigate();

    const isDark = useIsDark();

    return (
        <Button
            variant="light"
            isIconOnly={true}
            onPress={() => {
                navigate(-1);
            }}
        >
            <ArrowLeftIcon size={20} color={isDark ? "white" : "black"} />
        </Button>
    );
}
