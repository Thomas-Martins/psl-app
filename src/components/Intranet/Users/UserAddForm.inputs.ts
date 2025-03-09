import RolesProvider from "@core/api/Providers/RolesProvider.ts";
import { roleName } from "@utils/utils.ts";
import { validators } from "@components/Intranet/Users/UserAddForm.validators.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";
import i18n from "i18next";

export const UserAddModalInputs = async (): Promise<FieldDefinition[]> => {
    const response = await RolesProvider.getRoles();
    const rolesData = response.data as { id: number; name: string }[];
    const roleOptions = rolesData.map((role) => ({
        label: roleName(role.name) ?? i18n.t("users.add.unknown"),
        value: role.id,
    }));

    return [
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "lastname",
                    type: "text",
                    placeholder: i18n.t("users.add.inputs.lastname"),
                    label: i18n.t("users.add.inputs.lastname"),
                    required: true,
                    validators: [validators.lastname],
                },
                {
                    name: "firstname",
                    type: "text",
                    placeholder: i18n.t("users.add.inputs.firstname"),
                    label: i18n.t("users.add.inputs.firstname"),
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
                    label: i18n.t("users.add.inputs.email"),
                    required: true,
                    validators: [validators.email],
                },
                {
                    name: "phone",
                    type: "tel",
                    placeholder: "0601020304",
                    label: i18n.t("users.add.inputs.phone"),
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
                    placeholder: i18n.t("users.add.inputs.address"),
                    label: i18n.t("users.add.inputs.address"),
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
                    label: i18n.t("users.add.inputs.zipcode"),
                    required: true,
                    validators: [validators.zipcode],
                },
                {
                    name: "city",
                    type: "text",
                    placeholder: "Paris",
                    label: i18n.t("users.add.inputs.city"),
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
                    name: "role_id",
                    type: "select",
                    placeholder: i18n.t("users.add.inputs.role.placeholder"),
                    label: i18n.t("users.add.inputs.role.title"),
                    required: true,
                    options: roleOptions,
                    validators: [validators.role_id],
                },
            ],
        },
    ];
};
