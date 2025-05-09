import { Role } from "@/types/Role.ts";
import { OrderStatus } from "@/types/OrderStatus.ts";
import { Chip } from "@heroui/react";
import { ComponentProps } from "react";

type ChipColor = ComponentProps<typeof Chip>["color"];

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

const orderStatusNames: Record<string, string> = {
    [OrderStatus.PENDING]: "Non préparée",
    [OrderStatus.PROCESSING]: "En préparation",
    [OrderStatus.COMPLETED]: "Préparée",
    [OrderStatus.SHIPPED]: "Expédié",
    [OrderStatus.CANCELLED]: "Annulé",
};

export const orderStatusName = (status: OrderStatus): string =>
    orderStatusNames[status];

const orderStatusColors: Record<OrderStatus, ChipColor> = {
    [OrderStatus.PENDING]: "default",
    [OrderStatus.PROCESSING]: "primary",
    [OrderStatus.COMPLETED]: "success",
    [OrderStatus.SHIPPED]: "warning",
    [OrderStatus.CANCELLED]: "danger",
};

export const orderStatusColor = (status: OrderStatus): ChipColor =>
    orderStatusColors[status];

export const totalHtToTtc = (totalHt: number, tva: number): number => {
    return Number((totalHt + (totalHt * tva) / 100).toFixed(2));
};
