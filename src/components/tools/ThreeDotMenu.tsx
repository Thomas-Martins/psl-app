import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import ThreeDotIcons from "@components/ui/icons/ThreeDotIcons.tsx";
import { ThreeDotMenuProps } from "@/types/ThreeDotMenu.ts";

export default function ThreeDotMenu({ actions = [] }: ThreeDotMenuProps) {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light">
                    <ThreeDotIcons size={20} />
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
