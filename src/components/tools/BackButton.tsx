import { Button } from "@heroui/react";
import ArrowLeftIcon from "@components/ui/icons/ArrowLeftIcon.tsx";
import { useNavigate } from "react-router";

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            variant="light"
            isIconOnly={true}
            onPress={() => {
                navigate(-1);
            }}
        >
            <ArrowLeftIcon size={20} />
        </Button>
    );
}
