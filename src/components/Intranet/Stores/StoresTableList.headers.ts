import { TFunction } from "i18next";

export const StoresTableListHeaders = (t: TFunction) => [
    {
        key: "name",
        label: t("stores.table.headers.name"),
        sortable: true,
    },
    {
        key: "address",
        label: t("stores.table.headers.address"),
        sortable: false,
    },
    {
        key: "customers_count",
        label: t("stores.table.headers.customers_count"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("stores.table.headers.actions"),
        sortable: false,
    },
];
