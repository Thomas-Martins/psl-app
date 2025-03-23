import i18n from "i18next";

export const validators: {
    [field: string]: (value: string) => string | null;
} = {
    name: (value) => {
        if (!value) return i18n.t("generics.errors.add.name.required");
        if (value.length < 3) return i18n.t("generics.errors.name.value");
        return null;
    },
    firstname: (value) => {
        if (!value) return i18n.t("generics.errors.add.firstname.required");
        if (value.length < 3)
            return i18n.t("generics.errors.add.firstname.value");
        return null;
    },
    lastname: (value) => {
        if (!value) return i18n.t("generics.errors.add.lastname.required");
        if (value.length < 3)
            return i18n.t("generics.errors.add.lastname.value");
        return null;
    },
    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) return i18n.t("generics.errors.add.email.required");
        if (!emailRegex.test(value))
            return i18n.t("generics.errors.add.email.value");
        return null;
    },
    phone: (value) => {
        if (!value) return i18n.t("generics.errors.add.phone.required");
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
        if (!phoneRegex.test(value))
            return i18n.t("generics.errors.add.phone.value");
        return null;
    },
    address: (value) => {
        if (!value) return i18n.t("generics.errors.add.address.required");
        return null;
    },
    zipcode: (value) => {
        if (!value) return i18n.t("generics.errors.add.zipcode.required");
        const frZipRegex = /^[0-9]{5}$/;
        if (!frZipRegex.test(value))
            return i18n.t("generics.errors.add.zipcode.value");
        return null;
    },
    city: (value) => {
        if (!value) return i18n.t("generics.errors.add.city.required");
        return null;
    },
    country: (value) => {
        if (!value) return i18n.t("generics.errors.add.country.required");
        return null;
    },
    siret: (value) => {
        if (!value) return i18n.t("generics.errors.add.siret.required");
        const siretRegex = /^[0-9]{14}$/;
        if (!siretRegex.test(value))
            return i18n.t("generics.errors.add.siret.value");
        return null;
    },
    role: (value) => {
        if (!value) return i18n.t("generics.errors.add.role.required");
        return null;
    },
};
