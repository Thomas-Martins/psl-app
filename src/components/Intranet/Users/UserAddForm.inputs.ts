import { FieldDefinition, FormDataValue } from "@/types/FormTypes.ts";
import RolesProvider from "@core/api/Providers/RolesProvider.ts";
import { roleName } from "@utils/utils.ts";
import { validators } from "@/utils/InputForm.validators.ts";
import i18n from "i18next";

export const UserAddModalInputs = async (): Promise<FieldDefinition[]> => {
    try {
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
                        name: "image",
                        type: "file",
                        label: i18n.t("users.add.inputs.image"),
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
                type: "form-row",
                visible: true,
                elements: [
                    {
                        name: "lastname",
                        type: "text",
                        placeholder: i18n.t("users.add.inputs.lastname"),
                        label: i18n.t("users.add.inputs.lastname"),
                        required: true,
                        validators: [
                            (value: FormDataValue) =>
                                validators.lastname(
                                    typeof value === "string" ? value : "",
                                ),
                        ],
                    },
                    {
                        name: "firstname",
                        type: "text",
                        placeholder: i18n.t("users.add.inputs.firstname"),
                        label: i18n.t("users.add.inputs.firstname"),
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
                        name: "email",
                        type: "email",
                        placeholder: "example@mail.com",
                        label: i18n.t("users.add.inputs.email"),
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
                        label: i18n.t("users.add.inputs.phone"),
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
                        placeholder: i18n.t("users.add.inputs.address"),
                        label: i18n.t("users.add.inputs.address"),
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
                        label: i18n.t("users.add.inputs.zipcode"),
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
                        label: i18n.t("users.add.inputs.city"),
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
                        name: "role_id",
                        type: "select",
                        placeholder: i18n.t(
                            "users.add.inputs.role.placeholder",
                        ),
                        label: i18n.t("users.add.inputs.role.title"),
                        required: true,
                        options: roleOptions,
                        validators: [
                            (value: FormDataValue) =>
                                validators.role(
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
