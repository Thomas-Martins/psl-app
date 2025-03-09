import i18n from "i18next";

export const validators: {
    [field: string]: (value: string) => string | null;
} = {
    name: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.name.required");
        if (value.length < 3) return i18n.t("suppliers.add.errors.name.value");
        return null;
    },
    firstname: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.firstname.required");
        if (value.length < 3)
            return i18n.t("suppliers.add.errors.firstname.value");
        return null;
    },
    lastname: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.lastname.required");
        if (value.length < 3)
            return i18n.t("suppliers.add.errors.lastname.value");
        return null;
    },
    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) return i18n.t("suppliers.add.errors.email.required");
        if (!emailRegex.test(value))
            return i18n.t("suppliers.add.errors.email.value");
        return null;
    },
    phone: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.phone.required");
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
        if (!phoneRegex.test(value))
            return i18n.t("suppliers.add.errors.phone.value");
        return null;
    },
    address: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.address.required");
        return null;
    },
    zipcode: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.zipcode.required");
        const frZipRegex = /^[0-9]{5}$/;
        if (!frZipRegex.test(value))
            return i18n.t("suppliers.add.errors.zipcode.value");
        return null;
    },
    city: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.city.required");
        return null;
    },
    country: (value) => {
        if (!value) return i18n.t("suppliers.add.errors.country.required");
        return null;
    },
};
