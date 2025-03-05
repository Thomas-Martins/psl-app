import { Chip } from "@heroui/react";
import { chipRoleColor, roleName } from "@utils/utils.ts";

interface RoleChipProps {
    role: string;
}
export default function RoleChip({ role }: RoleChipProps) {
    return (
        <Chip
            className={`${role === "logisticien" ? "text-black" : "text-white"} ${chipRoleColor(role)}`}
            radius="sm"
            size="sm"
        >
            {roleName(role)}
        </Chip>
    );
}
