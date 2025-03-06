import i18n from "i18next";

export const validators: {
    [field: string]: (value: string) => string | undefined;
} = {
    firstname: (value) => {
        if (!value) return i18n.t("users.add.errors.firstname.required");
        if (value.length < 3) return i18n.t("users.add.errors.firstname.value");
    },
    lastname: (value) => {
        if (!value) return i18n.t("users.add.errors.lastname.required");
        if (value.length < 3) return i18n.t("users.add.errors.lastname.value");
    },
    email: (value) => {
        if (!value) return i18n.t("users.add.errors.email.required");
        if (!value.includes("@") || !value.includes("."))
            return i18n.t("users.add.errors.email.value");
    },
    phone: (value) => {
        if (!value) return i18n.t("users.add.errors.phone.required");
        if (value.length < 10) return i18n.t("users.add.errors.phone.value");
    },
    address: (value) => {
        if (!value) return i18n.t("users.add.errors.address.required");
    },
    zipcode: (value) => {
        if (!value) return i18n.t("users.add.errors.zipcode.required");
        if (value.length < 5) return i18n.t("users.add.errors.zipcode.value");
    },
    city: (value) => {
        if (!value) return i18n.t("users.add.errors.city.required");
    },
    role_id: (value) => {
        if (!value) return i18n.t("users.add.errors.role.required");
    },
};
