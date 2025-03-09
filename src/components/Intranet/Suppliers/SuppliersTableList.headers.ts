import i18n from "i18next";

export const SuppliersTableListHeaders = [
    {
        key: "name",
        label: i18n.t("suppliers.table.headers.name"),
        sortable: true,
    },
    {
        key: "contact",
        label: i18n.t("suppliers.table.headers.contact"),
        sortable: false,
    },
    {
        key: "address",
        label: i18n.t("suppliers.table.headers.address"),
        sortable: false,
    },
    {
        key: "actions",
        label: i18n.t("suppliers.table.headers.actions"),
        sortable: false,
    },
];
