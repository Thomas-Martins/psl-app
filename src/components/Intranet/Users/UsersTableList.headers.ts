import { TFunction } from "i18next";

export const UsersTableListHeaders = (t: TFunction) => [
    {
        key: "identity",
        label: t("users.table.headers.user"),
        sortable: true,
    },
    {
        key: "email",
        label: t("users.table.headers.email"),
        sortable: false,
    },
    {
        key: "phone",
        label: t("users.table.headers.phone"),
        sortable: false,
    },
    { key: "role", label: t("users.table.headers.role"), sortable: false },
    {
        key: "address",
        label: t("users.table.headers.address"),
        sortable: false,
    },
    {
        key: "actions",
        label: t("users.table.headers.actions"),
        sortable: false,
    },
];
