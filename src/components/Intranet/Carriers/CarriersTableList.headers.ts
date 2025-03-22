import { TFunction } from "i18next";

export const CarriersTableListHeaders = (t: TFunction) => [
    {
        key: "name",
        label: t("carriers.table.headers.name"),
        sortable: true,
    },
    {
        key: "contact",
        label: t("carriers.table.headers.contact"),
        sortable: false,
    },
    {
        key: "address",
        label: t("carriers.table.headers.address"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("carriers.table.headers.actions"),
        sortable: false,
    },
];
