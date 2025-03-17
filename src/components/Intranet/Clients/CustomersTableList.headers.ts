import i18n from "i18next";

export const CustomersTableListHeaders = [
    {
        key: "identity",
        label: i18n.t("customer.table.headers.name"),
        sortable: true,
    },
    {
        key: "store",
        label: i18n.t("customer.table.headers.store"),
        sortable: false,
    },
    {
        key: "address",
        label: i18n.t("customer.table.headers.address"),
        sortable: false,
    },
    {
        key: "commands_count",
        label: i18n.t("customer.table.headers.commands_count"),
        sortable: false,
    },
    {
        key: "actions",
        label: i18n.t("customer.table.headers.actions"),
        sortable: false,
    },
];
