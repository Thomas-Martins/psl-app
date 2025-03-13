import i18n from "i18next";

export const CarriersTableListHeaders = [
    {
        key: "name",
        label: i18n.t("carriers.table.headers.name"),
        sortable: true,
    },
    {
        key: "contact",
        label: i18n.t("carriers.table.headers.contact"),
        sortable: false,
    },
    {
        key: "address",
        label: i18n.t("carriers.table.headers.address"),
        sortable: false,
    },
    {
        key: "actions",
        label: i18n.t("carriers.table.headers.actions"),
        sortable: false,
    },
];
