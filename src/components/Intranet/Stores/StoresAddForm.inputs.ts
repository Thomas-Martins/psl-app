import { FieldDefinition, FormDataValue } from "@/types/FormTypes.ts";
import i18n from "i18next";
import { validators } from "@utils/InputForm.validators.ts";

export const StoresAddModalInputs = async (): Promise<FieldDefinition[]> => {
    try {
        return [
            {
                type: "form-row",
                visible: true,
                elements: [
                    {
                        name: "name",
                        type: "text",
                        placeholder: i18n.t("stores.add.inputs.name"),
                        label: i18n.t("stores.add.inputs.name"),
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
                        label: i18n.t("stores.add.inputs.email"),
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
                        label: i18n.t("stores.add.inputs.phone"),
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
                        placeholder: i18n.t("stores.add.inputs.address"),
                        label: i18n.t("stores.add.inputs.address"),
                        required: true,
                        validators: [
                            (value: FormDataValue) =>
                                validators.address(
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
                        name: "zipcode",
                        type: "text",
                        placeholder: "75000",
                        label: i18n.t("stores.add.inputs.zipcode"),
                        required: true,
                        validators: [
                            (value: FormDataValue) =>
                                validators.zipcode(
                                    typeof value === "string" ? value : "",
                                ),
                        ],
                    },
                    {
                        name: "city",
                        type: "text",
                        placeholder: "Paris",
                        label: i18n.t("stores.add.inputs.city"),
                        required: true,
                        validators: [
                            (value: FormDataValue) =>
                                validators.city(
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
                        name: "siret",
                        type: "text",
                        placeholder: "12345678901234",
                        label: i18n.t("stores.add.inputs.siret"),
                        required: true,
                        validators: [
                            (value: FormDataValue) =>
                                validators.siret(
                                    typeof value === "string" ? value : "",
                                ),
                        ],
                    },
                ],
            },
        ];
    } catch (e) {
        console.error(e);
        return [];
    }
};
