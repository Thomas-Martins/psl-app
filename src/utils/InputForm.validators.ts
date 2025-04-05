import i18n from "i18next";
import { FormDataValue } from "@/types/FormTypes.ts";

export const validators: {
    [field: string]: (value: FormDataValue) => string | null;
} = {
    name: (value) => {
        if (!value) return i18n.t("generics.errors.add.name.required");
        if (typeof value !== "string") return null;
        if (value.length < 3) return i18n.t("generics.errors.add.name.value");
        return null;
    },
    firstname: (value) => {
        if (!value) return i18n.t("generics.errors.add.firstname.required");
        if (typeof value !== "string") return null;
        if (value.length < 3)
            return i18n.t("generics.errors.add.firstname.value");
        return null;
    },
    lastname: (value) => {
        if (!value) return i18n.t("generics.errors.add.lastname.required");
        if (typeof value !== "string") return null;
        if (value.length < 3)
            return i18n.t("generics.errors.add.lastname.value");
        return null;
    },
    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) return i18n.t("generics.errors.add.email.required");
        if (typeof value !== "string") return null;
        if (!emailRegex.test(value))
            return i18n.t("generics.errors.add.email.value");
        return null;
    },
    phone: (value) => {
        if (!value) return i18n.t("generics.errors.add.phone.required");
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;
        if (typeof value !== "string") return null;
        if (!phoneRegex.test(value))
            return i18n.t("generics.errors.add.phone.value");
        return null;
    },
    address: (value) => {
        if (!value) return i18n.t("generics.errors.add.address.required");
        if (typeof value !== "string") return null;
        return null;
    },
    zipcode: (value) => {
        if (!value) return i18n.t("generics.errors.add.zipcode.required");
        const frZipRegex = /^[0-9]{5}$/;
        if (typeof value !== "string") return null;
        if (!frZipRegex.test(value))
            return i18n.t("generics.errors.add.zipcode.value");
        return null;
    },
    city: (value) => {
        if (!value) return i18n.t("generics.errors.add.city.required");
        if (typeof value !== "string") return null;
        return null;
    },
    country: (value) => {
        if (!value) return i18n.t("generics.errors.add.country.required");
        if (typeof value !== "string") return null;
        return null;
    },
    siret: (value) => {
        if (!value) return i18n.t("generics.errors.add.siret.required");
        const siretRegex = /^[0-9]{14}$/;
        if (typeof value !== "string") return null;
        if (!siretRegex.test(value))
            return i18n.t("generics.errors.add.siret.value");
        return null;
    },
    role: (value) => {
        if (!value) return i18n.t("generics.errors.add.role.required");
        if (typeof value !== "string") return null;
        return null;
    },
    stock: (value) => {
        if (!value) return i18n.t("generics.errors.add.stock.required");
        const numberRegex = /^[0-9]+$/;
        if (typeof value !== "string") return null;
        if (!numberRegex.test(value))
            return i18n.t("generics.errors.add.stock.value");
        return null;
    },
    reference: (value) => {
        if (!value) return i18n.t("generics.errors.add.reference.required");
        const referenceRegex = /^REF-[0-9]{4}-[0-9]{4}$/;
        if (typeof value !== "string") return null;
        if (!referenceRegex.test(value))
            return i18n.t("generics.errors.add.reference.value");
        return null;
    },
    location: (value) => {
        if (!value) return i18n.t("generics.errors.add.location.required");
        const locationRegex = /^A[0-9]{2}-E[0-9]{2}$/;
        if (typeof value !== "string") return null;
        if (!locationRegex.test(value))
            return i18n.t("generics.errors.add.location.value");
        return null;
    },
};
