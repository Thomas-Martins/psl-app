import { TFunction } from "i18next";

export const UsersTableListHeaders = (t: TFunction) => [
    {
        key: "identity",
        label: t("users.table.headers.user"),
        sortable: true,
    },
    { key: "email", label: t("users.table.headers.email"), sortable: true },
    { key: "phone", label: t("users.table.headers.phone"), sortable: true },
    { key: "role", label: t("users.table.headers.role"), sortable: false },
    {
        key: "actions",
        label: t("users.table.headers.actions"),
        sortable: false,
    },
];
