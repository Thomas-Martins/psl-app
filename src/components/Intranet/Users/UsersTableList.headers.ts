import i18n from "i18next";

export const UsersTableListHeaders = [
    { key: "identity", label: i18n.t("users.table.headers.user") },
    { key: "email", label: i18n.t("users.table.headers.email") },
    { key: "phone", label: i18n.t("users.table.headers.phone") },
    { key: "role", label: i18n.t("users.table.headers.role") },
    { key: "address", label: i18n.t("users.table.headers.address") },
    { key: "actions", label: i18n.t("users.table.headers.actions") },
];
