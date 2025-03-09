export interface InputField {
    name: string;
    type: Exclude<string, "form-row" | "form-title">;
    placeholder?: string;
    label: string;
    errorMessage?: string;
    required?: boolean;
    options?: { label: string; value: number }[];
    validators?: ((value: string) => string | null)[];
}

export interface FormRowDefinition {
    type: "form-row";
    visible: boolean;
    elements: InputField[];
}

// Nouveau type pour un titre de formulaire
export interface FormTitleDefinition {
    type: "form-title";
    visible: boolean;
    title: string;
}

export type FieldDefinition =
    | InputField
    | FormRowDefinition
    | FormTitleDefinition;

export function isFormRow(field: FieldDefinition): field is FormRowDefinition {
    return field.type === "form-row";
}

export function isFormTitle(
    field: FieldDefinition,
): field is FormTitleDefinition {
    return field.type === "form-title";
}
