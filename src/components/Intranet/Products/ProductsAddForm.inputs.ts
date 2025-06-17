import { FieldDefinition, FormDataValue } from "@/types/FormTypes.ts";
import i18n from "i18next";
import { validators } from "@utils/InputForm.validators.ts";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import CategoriesProvider from "@core/api/Providers/CategoriesProvider.ts";

export const ProductsAddFormInputs = async (): Promise<FieldDefinition[]> => {
    const suppliersResponse = await SuppliersProvider.getSuppliers();
    const suppliersData = suppliersResponse.data as {
        id: string;
        name: string;
    }[];
    const suppliersOptions = suppliersData.map((supplier) => ({
        label: supplier.name,
        value: supplier.id,
    }));

    const categoriesResponse = await CategoriesProvider.getCategories();
    const categoriesData = categoriesResponse.data as {
        id: string;
        name: string;
    }[];
    const categoriesOptions = [
        {
            label: i18n.t("categories.inputs.title"),
            value: "add-category",
        },
        ...categoriesData.map((category) => ({
            label: category.name,
            value: category.id,
        })),
    ];

    return [
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "image",
                    type: "file",
                    label: i18n.t("products.add.inputs.image"),
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
                    name: "name",
                    type: "text",
                    placeholder: i18n.t("products.add.inputs.name"),
                    label: i18n.t("products.add.inputs.name"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.name(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "category_id",
                    type: "select",
                    placeholder: i18n.t(
                        "products.add.inputs.category.placeholder",
                    ),
                    label: i18n.t("products.add.inputs.category.title"),
                    required: true,
                    options: categoriesOptions,
                },
            ],
        },
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "description",
                    type: "textarea",
                    placeholder: i18n.t("products.add.inputs.description"),
                    label: i18n.t("products.add.inputs.description"),
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
                    name: "supplier_id",
                    type: "select",
                    placeholder: i18n.t(
                        "products.add.inputs.supplier.placeholder",
                    ),
                    label: i18n.t("products.add.inputs.supplier.title"),
                    required: true,
                    options: suppliersOptions,
                },
                {
                    name: "stock",
                    type: "number",
                    placeholder: i18n.t("products.add.inputs.stock"),
                    label: i18n.t("products.add.inputs.stock"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.stock(
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
                    name: "reference",
                    type: "text",
                    placeholder: "REF-XXXX-XXXX",
                    label: i18n.t("products.add.inputs.reference"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.reference(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "location",
                    type: "text",
                    placeholder: "A12-E15",
                    label: i18n.t("products.add.inputs.location"),
                    required: true,
                    validators: [
                        (value: FormDataValue) =>
                            validators.location(
                                typeof value === "string" ? value : "",
                            ),
                    ],
                },
                {
                    name: "price",
                    type: "price",
                    placeholder: "Prix",
                    label: i18n.t("products.add.inputs.price"),
                    required: true,
                    validators: [
                        (value: FormDataValue) => {
                            if (!value)
                                return i18n.t(
                                    "generics.errors.add.price.required",
                                );
                            if (typeof value !== "string") return null;
                            const priceRegex = /^\d+(\.\d{1,2})?$/;
                            if (!priceRegex.test(value))
                                return i18n.t(
                                    "generics.errors.add.price.value",
                                );
                            return null;
                        },
                    ],
                },
            ],
        },
    ];
};
