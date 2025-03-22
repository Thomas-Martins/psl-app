import { FieldDefinition } from "@/types/FormTypes.ts";
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
                        label: i18n.t("stores.add.inputs.email"),
                        required: true,
                        validators: [validators.email],
                    },
                    {
                        name: "phone",
                        type: "tel",
                        placeholder: "0601020304",
                        label: i18n.t("stores.add.inputs.phone"),
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
                        placeholder: i18n.t("stores.add.inputs.address"),
                        label: i18n.t("stores.add.inputs.address"),
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
                        label: i18n.t("stores.add.inputs.zipcode"),
                        required: true,
                        validators: [validators.zipcode],
                    },
                    {
                        name: "city",
                        type: "text",
                        placeholder: "Paris",
                        label: i18n.t("stores.add.inputs.city"),
                        required: true,
                        validators: [validators.city],
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
                        validators: [validators.siret],
                    },
                ],
            },
        ];
    } catch (e) {
        console.error(e);
        return [];
    }
};
