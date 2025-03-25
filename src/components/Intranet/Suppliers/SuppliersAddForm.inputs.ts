import { FieldDefinition, FormDataValue } from "@/types/FormTypes.ts";
import { validators } from "@/utils/InputForm.validators.ts";
import i18n from "i18next";

export const SuppliersAddModalInputs = async (): Promise<FieldDefinition[]> => {
    return [
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "image",
                    type: "file",
                    label: i18n.t("suppliers.add.inputs.image"),
                    validators: [
                        (file: FormDataValue) => {
                            if (
                                file instanceof File &&
                                file.size > 2048 * 1024
                            ) {
                                return "L'image ne doit pas dépasser 2 Mo";
                            }
                            return null;
                        },
                    ],
                },
            ],
        },
        {
            type: "form-title",
            visible: true,
            title: i18n.t("suppliers.add.inputs.title"),
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "name",
                    type: "text",
                    placeholder: i18n.t("suppliers.add.inputs.name"),
                    label: i18n.t("suppliers.add.inputs.name"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.name(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
            ],
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "email",
                    type: "email",
                    placeholder: "example@mail.com",
                    label: i18n.t("suppliers.add.inputs.email"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.email(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "phone",
                    type: "tel",
                    placeholder: "0601020304",
                    label: i18n.t("suppliers.add.inputs.phone"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.phone(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
            ],
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "address",
                    type: "text",
                    placeholder: i18n.t("suppliers.add.inputs.address"),
                    label: i18n.t("suppliers.add.inputs.address"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.address(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "zipcode",
                    type: "text",
                    placeholder: "75000",
                    label: i18n.t("suppliers.add.inputs.zipcode"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.zipcode(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
            ],
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "city",
                    type: "text",
                    placeholder: "Paris",
                    label: i18n.t("suppliers.add.inputs.city"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.city(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "country",
                    type: "text",
                    placeholder: "France",
                    label: i18n.t("suppliers.add.inputs.country"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.country(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
            ],
        },
        {
            type: "form-title",
            visible: true,
            title: i18n.t("suppliers.add.inputs.subtitle"),
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "contact_person_lastname",
                    type: "text",
                    placeholder: i18n.t(
                        "suppliers.add.inputs.contact_person_lastname",
                    ),
                    label: i18n.t(
                        "suppliers.add.inputs.contact_person_lastname",
                    ),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.lastname(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "contact_person_firstname",
                    type: "text",
                    placeholder: i18n.t(
                        "suppliers.add.inputs.contact_person_firstname",
                    ),
                    label: i18n.t(
                        "suppliers.add.inputs.contact_person_firstname",
                    ),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.firstname(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
            ],
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "contact_person_email",
                    type: "email",
                    placeholder: "example@mail.com",
                    label: i18n.t("suppliers.add.inputs.contact_person_email"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.email(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "contact_person_phone",
                    type: "tel",
                    placeholder: "0601020304",
                    label: i18n.t("suppliers.add.inputs.contact_person_phone"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.phone(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
            ],
        },
    ];
};
