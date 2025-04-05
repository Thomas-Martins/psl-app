import { TFunction } from "i18next";

export const ProductsTableListHeaders = (t: TFunction) => [
    {
        key: "name",
        label: t("products.table.headers.name"),
        sortable: true,
    },
    {
        key: "reference",
        label: t("products.table.headers.reference"),
        sortable: false,
    },
    {
        key: "location",
        label: t("products.table.headers.location"),
        sortable: false,
    },
    {
        key: "quantité",
        label: t("products.table.headers.stock"),
        sortable: false,
    },
    {
        key: "prix",
        label: t("products.table.headers.price"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("products.table.headers.actions"),
        sortable: false,
    },
];
