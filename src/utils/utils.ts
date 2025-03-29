import { Role } from "@/types/Role.ts";

const roleNames: Record<Role, string> = {
    [Role.ADMIN]: "Administrateur",
    [Role.GESTIONNAIRE]: "Gestionnaire",
    [Role.LOGISTICIEN]: "Logisticien",
    [Role.CLIENT]: "Client",
};

export const roleName = (role: Role): string => roleNames[role];

const roleColors: Record<Role, string> = {
    [Role.ADMIN]: "bg-primary-400",
    [Role.GESTIONNAIRE]: "bg-violet",
    [Role.LOGISTICIEN]: "bg-light-100",
    [Role.CLIENT]: "",
};

export const chipRoleColor = (role: Role): string => roleColors[role];

export const InitialsLetter = (firstname: string, lastname: string) => {
    return firstname.charAt(0) + lastname.charAt(0);
};
