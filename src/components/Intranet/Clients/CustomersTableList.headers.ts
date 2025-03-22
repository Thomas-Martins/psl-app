import { TFunction } from "i18next";

export const CustomersTableListHeaders = (t: TFunction) => [
    {
        key: "identity",
        label: t("customer.table.headers.name"),
        sortable: true,
    },
    {
        key: "store",
        label: t("customer.table.headers.store"),
        sortable: false,
    },
    {
        key: "address",
        label: t("customer.table.headers.address"),
        sortable: false,
    },
    {
        key: "commands_count",
        label: t("customer.table.headers.commands_count"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("customer.table.headers.actions"),
        sortable: false,
    },
];
