import { FieldDefinition } from "@/types/FormTypes.ts";
import i18n from "i18next";
import { validators } from "@utils/InputForm.validators.ts";
import StoresProvider from "@core/api/Providers/StoresProvider.ts";

export const CustomersAddModalInputs = async (): Promise<FieldDefinition[]> => {
    try {
        const response = await StoresProvider.getStores();
        const storesData = response.data as { id: string; name: string }[];
        const storesOptions = storesData.map((store) => ({
            label: store.name,
            value: store.id,
        }));

        return [
            {
                type: "form-row",
                visible: true,
                elements: [
                    {
                        name: "lastname",
                        type: "text",
                        placeholder: i18n.t("customer.add.inputs.lastname"),
                        label: i18n.t("customer.add.inputs.lastname"),
                        required: true,
                        validators: [validators.lastname],
                    },
                    {
                        name: "firstname",
                        type: "text",
                        placeholder: i18n.t("customer.add.inputs.firstname"),
                        label: i18n.t("customer.add.inputs.firstname"),
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
                        name: "email",
                        type: "email",
                        placeholder: "example@mail.com",
                        label: i18n.t("customer.add.inputs.email"),
                        required: true,
                        validators: [validators.email],
                    },
                    {
                        name: "phone",
                        type: "tel",
                        placeholder: "0601020304",
                        label: i18n.t("customer.add.inputs.phone"),
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
                        placeholder: i18n.t("customer.add.inputs.address"),
                        label: i18n.t("customer.add.inputs.address"),
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
                        label: i18n.t("customer.add.inputs.zipcode"),
                        required: true,
                        validators: [validators.zipcode],
                    },
                    {
                        name: "city",
                        type: "text",
                        placeholder: "Paris",
                        label: i18n.t("customer.add.inputs.city"),
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
                        name: "store_id",
                        type: "select",
                        placeholder: i18n.t(
                            "customer.add.inputs.store.placeholder",
                        ),
                        label: i18n.t("customer.add.inputs.store.title"),
                        required: true,
                        options: storesOptions,
                    },
                ],
            },
        ];
    } catch (e) {
        console.error(e);
        return [];
    }
};
