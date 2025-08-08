import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import ThreeDotIcons from "@components/ui/icons/ThreeDotIcons.tsx";
import { ThreeDotMenuProps } from "@/types/ThreeDotMenu.ts";
import { useIsDark } from "@/utils/hook/useIsDark";

export default function ThreeDotMenu({ actions = [] }: ThreeDotMenuProps) {
    const isDark = useIsDark();

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light">
                    <ThreeDotIcons
                        size={20}
                        color={isDark ? "white" : "black"}
                    />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="three-dot-menu-item" variant="solid">
                {actions?.map((action) => (
                    <DropdownItem
                        color={action.variant}
                        key={action.label}
                        onPress={action.onClick}
                    >
                        {action.label}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
}
