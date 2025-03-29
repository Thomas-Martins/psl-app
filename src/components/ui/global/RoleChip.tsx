import { Chip } from "@heroui/react";
import { Role } from "@/types/Role.ts";
import { chipRoleColor, roleName } from "@utils/utils.ts";

interface RoleChipProps {
    role: Role;
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
