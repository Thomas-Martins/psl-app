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
        sortable: true,
    },
    {
        key: "location",
        label: t("products.table.headers.location"),
        sortable: true,
    },
    {
        key: "stock",
        label: t("products.table.headers.stock"),
        sortable: false,
    },
    {
        key: "price",
        label: t("products.table.headers.price"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("products.table.headers.actions"),
        sortable: false,
    },
];
