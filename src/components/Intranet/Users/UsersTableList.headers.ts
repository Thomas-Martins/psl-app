import i18n from "i18next";

export const UsersTableListHeaders = [
    {
        key: "identity",
        label: i18n.t("users.table.headers.user"),
        sortable: true,
    },
    {
        key: "email",
        label: i18n.t("users.table.headers.email"),
        sortable: false,
    },
    {
        key: "phone",
        label: i18n.t("users.table.headers.phone"),
        sortable: false,
    },
    { key: "role", label: i18n.t("users.table.headers.role"), sortable: false },
    {
        key: "address",
        label: i18n.t("users.table.headers.address"),
        sortable: false,
    },
    {
        key: "actions",
        label: i18n.t("users.table.headers.actions"),
        sortable: false,
    },
];
