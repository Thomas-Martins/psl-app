import i18n from "i18next";

export const validators: {
    [field: string]: (value: string) => string | null;
} = {
    firstname: (value) => {
        if (!value) return i18n.t("users.add.errors.firstname.required");
        if (value.length < 3) return i18n.t("users.add.errors.firstname.value");
        return null;
    },
    lastname: (value) => {
        if (!value) return i18n.t("users.add.errors.lastname.required");
        if (value.length < 3) return i18n.t("users.add.errors.lastname.value");
        return null;
    },
    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) return i18n.t("users.add.errors.email.required");
        if (!emailRegex.test(value))
            return i18n.t("users.add.errors.email.value");
        return null;
    },
    phone: (value) => {
        if (!value) return i18n.t("users.add.errors.phone.required");
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
        if (!phoneRegex.test(value))
            return i18n.t("users.add.errors.phone.value");
        return null;
    },
    address: (value) => {
        if (!value) return i18n.t("users.add.errors.address.required");
        return null;
    },
    zipcode: (value) => {
        if (!value) return i18n.t("users.add.errors.zipcode.required");
        const frZipRegex = /^[0-9]{5}$/;
        if (!frZipRegex.test(value))
            return i18n.t("users.add.errors.zipcode.value");
        return null;
    },
    city: (value) => {
        if (!value) return i18n.t("users.add.errors.city.required");
        return null;
    },
    role_id: (value) => {
        if (!value) return i18n.t("users.add.errors.role.required");
        return null;
    },
};
