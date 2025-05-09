import { TFunction } from "i18next";

export const OrdersTableListHeaders = (t: TFunction) => [
    {
        key: "reference",
        label: t("orders.table.headers.reference"),
        sortable: true,
    },
    {
        key: "status",
        label: t("orders.table.headers.status"),
        sortable: true,
    },
    {
        key: "estimated_delivery_date",
        label: t("orders.table.headers.date_delivery"),
        sortable: false,
    },
    {
        key: "address",
        label: t("orders.table.headers.address"),
        sortable: false,
    },
    {
        key: "customer",
        label: t("orders.table.headers.customer"),
        sortable: false,
    },
    {
        key: "product_count",
        label: t("orders.table.headers.products_count"),
        sortable: false,
    },
    {
        key: "total_price",
        label: t("orders.table.headers.total_ht"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("products.table.headers.actions"),
        sortable: false,
    },
];
