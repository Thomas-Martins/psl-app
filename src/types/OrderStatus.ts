import i18n from "i18next";

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    SHIPPED = "shipped",
    CANCELLED = "cancelled",
}
export const OrderStatusLabels = {
    [OrderStatus.PENDING]: i18n.t("orders.status.pending"),
    [OrderStatus.PROCESSING]: i18n.t("orders.status.processing"),
    [OrderStatus.COMPLETED]: i18n.t("orders.status.completed"),
    [OrderStatus.SHIPPED]: i18n.t("orders.status.shipped"),
    [OrderStatus.CANCELLED]: i18n.t("orders.status.cancelled"),
};
