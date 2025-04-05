export interface InputField {
    name: string;
    type: Exclude<string, "form-row" | "form-title">;
    placeholder?: string;
    label: string;
    errorMessage?: string;
    required?: boolean;
    options?: { label: string; value: number }[];
    validators?: ((value: FormDataValue) => string | null)[];
}

export interface FormRowDefinition {
    type: "form-row";
    visible: boolean;
    elements: InputField[];
}

export interface FormTitleDefinition {
    type: "form-title";
    visible: boolean;
    title: string;
}

export type FieldDefinition =
    | InputField
    | FormRowDefinition
    | FormTitleDefinition;

export type FormDataValue = string | File | number | null;
export type FormValues = Record<string, FormDataValue>;

export function isFormRow(field: FieldDefinition): field is FormRowDefinition {
    return field.type === "form-row";
}

export function isFormTitle(
    field: FieldDefinition,
): field is FormTitleDefinition {
    return field.type === "form-title";
}
