import { TFunction } from "i18next";

export const SuppliersTableListHeaders = (t: TFunction) => [
    {
        key: "name",
        label: t("suppliers.table.headers.name"),
        sortable: true,
    },
    {
        key: "contact",
        label: t("suppliers.table.headers.contact"),
        sortable: false,
    },
    {
        key: "address",
        label: t("suppliers.table.headers.address"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("suppliers.table.headers.actions"),
        sortable: false,
    },
];
