import { FieldDefinition } from "@/types/FormTypes";

export const ProductsAddStockInputs = (): FieldDefinition[] => {
    return [
        {
            type: "form-row",
            visible: true,
            elements: [
                {
                    name: "quantity",
                    type: "number",
                    label: "Quantité",
                },
            ],
        },
    ];
};
