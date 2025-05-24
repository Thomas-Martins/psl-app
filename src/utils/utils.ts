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
    [Role.ADMIN]: "bg-blue-500 text-white",
    [Role.GESTIONNAIRE]: "bg-violet-700 text-white",
    [Role.LOGISTICIEN]: "bg-foreground-500 text-white",
    [Role.CLIENT]: "default",
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
    const ttc = totalHt * (1 + tva / 100);
    return Number(ttc.toFixed(2));
};

type PDFData =
    | string
    | Blob
    | ArrayBuffer
    | { data: Uint8Array | ArrayBuffer | string };

export const downloadPDF = (pdfData: PDFData): void => {
    let blob: Blob;

    if (typeof pdfData === "string") {
        blob = new Blob([pdfData], { type: "application/pdf" });
    } else if (pdfData instanceof Blob) {
        blob = pdfData;
    } else if (pdfData instanceof ArrayBuffer) {
        blob = new Blob([pdfData], { type: "application/pdf" });
    } else {
        blob = new Blob([pdfData.data], { type: "application/pdf" });
    }

    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");

    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
    }, 100);
};
