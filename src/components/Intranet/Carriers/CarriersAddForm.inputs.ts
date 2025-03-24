import { FieldDefinition } from "@/types/FormTypes.ts";
import { validators } from "@/utils/InputForm.validators.ts";
import i18n from "i18next";

export const CarriersAddFormInputs = async (): Promise<FieldDefinition[]> => {
    return [
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "image",
                    type: "file",
                    label: "Ajouter une image de profil",
                    required: true,
                },
            ],
        },
        {
            type: "form-title",
            visible: true,
            title: i18n.t("carriers.add.inputs.title"),
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "name",
                    type: "text",
                    placeholder: i18n.t("carriers.add.inputs.name"),
                    label: i18n.t("carriers.add.inputs.name"),
                    required: true,
                    validators: [validators.name],
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
                    label: i18n.t("carriers.add.inputs.email"),
                    required: true,
                    validators: [validators.email],
                },
                {
                    name: "phone",
                    type: "tel",
                    placeholder: "0601020304",
                    label: i18n.t("carriers.add.inputs.phone"),
                    required: true,
                    validators: [validators.phone],
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
                    placeholder: i18n.t("carriers.add.inputs.address"),
                    label: i18n.t("carriers.add.inputs.address"),
                    required: true,
                    validators: [validators.address],
                },
            ],
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "zipcode",
                    type: "text",
                    placeholder: "75000",
                    label: i18n.t("carriers.add.inputs.zipcode"),
                    required: true,
                    validators: [validators.zipcode],
                },
                {
                    name: "city",
                    type: "text",
                    placeholder: "Paris",
                    label: i18n.t("carriers.add.inputs.city"),
                    required: true,
                    validators: [validators.city],
                },
            ],
        },
        {
            type: "form-title",
            visible: true,
            title: i18n.t("carriers.add.inputs.subtitle"),
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "contact_person_lastname",
                    type: "text",
                    placeholder: i18n.t(
                        "carriers.add.inputs.contact_person_lastname",
                    ),
                    label: i18n.t(
                        "carriers.add.inputs.contact_person_lastname",
                    ),
                    required: true,
                    validators: [validators.lastname],
                },
                {
                    name: "contact_person_firstname",
                    type: "text",
                    placeholder: i18n.t(
                        "carriers.add.inputs.contact_person_firstname",
                    ),
                    label: i18n.t(
                        "carriers.add.inputs.contact_person_firstname",
                    ),
                    required: true,
                    validators: [validators.firstname],
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
                    label: i18n.t("carriers.add.inputs.contact_person_email"),
                    required: true,
                    validators: [validators.email],
                },
                {
                    name: "contact_person_phone",
                    type: "tel",
                    placeholder: "0601020304",
                    label: i18n.t("carriers.add.inputs.contact_person_phone"),
                    required: true,
                    validators: [validators.phone],
                },
            ],
        },
    ];
};
