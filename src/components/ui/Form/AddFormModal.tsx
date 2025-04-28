import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    NumberInput,
    Select,
    SelectItem,
} from "@heroui/react";
import {
    FieldDefinition,
    FormDataValue,
    FormValues,
    InputField,
    isFormRow,
    isFormTitle,
} from "@/types/FormTypes";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import UploadFileIcon from "@/components/ui/icons/UploadFileIcon";

// Garde de type pour vérifier que le champ est bien un InputField
function isInputField(field: FieldDefinition): field is InputField {
    return field.type !== "form-row" && field.type !== "form-title";
}

interface AddFormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    fields: FieldDefinition[];
    onSubmit: (data: FormValues) => Promise<void> | void;
    title?: string;
}

export default function AddFormModal({
    isOpen,
    onOpenChange,
    fields,
    onSubmit,
    title = i18n.t("generics.add"),
}: AddFormModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormValues>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [previewImages, setPreviewImages] = useState<Record<string, string>>(
        {},
    );

    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const handleNumberChange =
        (name: string) =>
        (input: number | React.ChangeEvent<HTMLInputElement>) => {
            if (typeof input === "number") {
                handleInputChange(name, input);
            } else {
                handleInputChange(name, Number(input.target.value));
            }
        };

    useEffect(() => {
        if (isOpen) {
            const initialData: FormValues = {};
            fields.forEach((field) => {
                if (isFormRow(field)) {
                    field.elements.forEach((el) => {
                        initialData[el.name] =
                            el.type === "file"
                                ? null
                                : el.type === "price"
                                  ? 0
                                  : "";
                    });
                } else if (!isFormTitle(field)) {
                    initialData[field.name] =
                        field.type === "file"
                            ? null
                            : field.type === "price"
                              ? 0
                              : "";
                }
            });
            setFormData(initialData);
            setErrors({});
            setPreviewImages({});
        }
    }, [isOpen, fields]);

    const handleInputChange = (name: string, value: FormDataValue) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = (): boolean => {
        let valid = true;
        const newErrors: Record<string, string> = {};

        fields.forEach((field) => {
            if (isFormRow(field)) {
                field.elements.forEach((el) => {
                    const value = formData[el.name];
                    if (
                        el.required &&
                        ((el.type !== "file" && !value) ||
                            (el.type === "file" && value === null))
                    ) {
                        valid = false;
                        newErrors[el.name] =
                            el.errorMessage || t("generics.errors.required");
                    }
                    if (el.validators) {
                        for (const validator of el.validators) {
                            const errorMsg = validator(value);
                            if (errorMsg) {
                                valid = false;
                                newErrors[el.name] = errorMsg;
                                break;
                            }
                        }
                    }
                });
            } else if (!isFormTitle(field)) {
                const value = formData[field.name];
                if (
                    field.required &&
                    ((field.type !== "file" && !value) ||
                        (field.type === "file" && value === null))
                ) {
                    valid = false;
                    newErrors[field.name] =
                        field.errorMessage || t("generics.errors.required");
                }
                if (field.validators) {
                    for (const validator of field.validators) {
                        const errorMsg = validator(value);
                        if (errorMsg) {
                            valid = false;
                            newErrors[field.name] = errorMsg;
                            break;
                        }
                    }
                }
            }
        });

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        if (validate()) {
            try {
                await onSubmit(formData);
                onOpenChange(false);
            } catch (e) {
                console.error(e);
            }
        }
    };

    const renderCustomFileInput = (
        name: string,
        label: string,
        errorMessage?: string,
    ) => (
        <div className="flex flex-row items-center gap-4">
            <div
                className="w-[100px] h-[100px] bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:bg-light-800 transition-colors duration-200"
                onClick={() => fileInputRefs.current[name]?.click()}
            >
                {previewImages[name] ? (
                    <img
                        src={previewImages[name]}
                        alt="Preview"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <UploadFileIcon color="white" />
                )}
                <input
                    type="file"
                    name={name}
                    accept=".jpeg, .jpg, .png"
                    className="hidden"
                    ref={(ref) => {
                        fileInputRefs.current[name] = ref;
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file =
                            e.target.files && e.target.files[0]
                                ? e.target.files[0]
                                : null;
                        handleInputChange(name, file);
                        if (file) {
                            setPreviewImages((prev) => ({
                                ...prev,
                                [name]: URL.createObjectURL(file),
                            }));
                        }
                    }}
                />
            </div>
            <div>
                <label className="font-medium">{label}</label>
                <p className="text-xs text-gray-500">
                    {t("generics.image_format")}
                </p>
                {errorMessage && (
                    <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
                )}
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="2xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {title}
                        </ModalHeader>
                        <ModalBody>
                            <Form
                                id="add-form"
                                onSubmit={handleSubmit}
                                validationErrors={errors}
                            >
                                {fields.map((field) => {
                                    if (isFormTitle(field)) {
                                        if (!field.visible) return null;
                                        return (
                                            <div
                                                key={"title-" + field.title}
                                                className="mb-4"
                                            >
                                                <h3 className="text-sm font-medium">
                                                    {field.title}
                                                </h3>
                                            </div>
                                        );
                                    }
                                    if (isFormRow(field)) {
                                        if (!field.visible) return null;
                                        return (
                                            <div
                                                key={
                                                    "row-" +
                                                    field.elements
                                                        .map((el) => el.name)
                                                        .join("-")
                                                }
                                                className="mb-4 flex flex-row gap-4 w-full"
                                            >
                                                {field.elements.map((el) => (
                                                    <div
                                                        key={el.name}
                                                        className="flex-1"
                                                    >
                                                        {el.type ===
                                                        "select" ? (
                                                            <Select
                                                                label={el.label}
                                                                labelPlacement="outside"
                                                                name={el.name}
                                                                placeholder={
                                                                    el.placeholder
                                                                }
                                                                isRequired={
                                                                    el.required
                                                                }
                                                                aria-label={
                                                                    el.label
                                                                }
                                                                onChange={(
                                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                                ) =>
                                                                    handleInputChange(
                                                                        el.name,
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            >
                                                                {el.options?.map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            data-value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                ) ?? null}
                                                            </Select>
                                                        ) : el.type ===
                                                          "file" ? (
                                                            renderCustomFileInput(
                                                                el.name,
                                                                el.label,
                                                                errors[
                                                                    el.name
                                                                ] ||
                                                                    el.errorMessage,
                                                            )
                                                        ) : el.type ===
                                                          "price" ? (
                                                            <NumberInput
                                                                label={el.label}
                                                                labelPlacement="outside"
                                                                name={el.name}
                                                                placeholder={
                                                                    el.placeholder
                                                                }
                                                                isRequired={
                                                                    el.required
                                                                }
                                                                errorMessage={
                                                                    errors[
                                                                        el.name
                                                                    ] ||
                                                                    el.errorMessage
                                                                }
                                                                min={0}
                                                                hideStepper
                                                                endContent={
                                                                    <div className="pointer-events-none flex items-center">
                                                                        <span className="text-default-400 text-small">
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                }
                                                                value={
                                                                    typeof formData[
                                                                        el.name
                                                                    ] ===
                                                                    "number"
                                                                        ? (formData[
                                                                              el
                                                                                  .name
                                                                          ] as number)
                                                                        : 0
                                                                }
                                                                onChange={handleNumberChange(
                                                                    el.name,
                                                                )}
                                                            />
                                                        ) : (
                                                            <Input
                                                                label={el.label}
                                                                name={el.name}
                                                                labelPlacement="outside"
                                                                placeholder={
                                                                    el.placeholder
                                                                }
                                                                type={el.type}
                                                                isRequired={
                                                                    el.required
                                                                }
                                                                errorMessage={
                                                                    errors[
                                                                        el.name
                                                                    ] ||
                                                                    el.errorMessage
                                                                }
                                                                value={
                                                                    (formData[
                                                                        el.name
                                                                    ] as string) ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        el.name,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    if (isInputField(field)) {
                                        return (
                                            <div
                                                key={field.name}
                                                className="mb-4"
                                            >
                                                {field.type === "select" ? (
                                                    <Select
                                                        label={field.label}
                                                        labelPlacement="outside"
                                                        name={field.name}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        isRequired={
                                                            field.required
                                                        }
                                                        aria-label={field.label}
                                                        onChange={(
                                                            event: React.ChangeEvent<HTMLSelectElement>,
                                                        ) =>
                                                            handleInputChange(
                                                                field.name,
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        {field.options?.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    data-value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </SelectItem>
                                                            ),
                                                        ) ?? null}
                                                    </Select>
                                                ) : field.type === "file" ? (
                                                    renderCustomFileInput(
                                                        field.name,
                                                        field.label,
                                                        errors[field.name] ||
                                                            field.errorMessage,
                                                    )
                                                ) : field.type === "price" ? (
                                                    <NumberInput
                                                        label={field.label}
                                                        labelPlacement="outside"
                                                        name={field.name}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        isRequired={
                                                            field.required
                                                        }
                                                        errorMessage={
                                                            errors[
                                                                field.name
                                                            ] ||
                                                            field.errorMessage
                                                        }
                                                        min={0}
                                                        hideStepper
                                                        endContent={
                                                            <div className="pointer-events-none flex items-center">
                                                                <span className="text-default-400 text-small">
                                                                    €
                                                                </span>
                                                            </div>
                                                        }
                                                        value={
                                                            typeof formData[
                                                                field.name
                                                            ] === "number"
                                                                ? (formData[
                                                                      field.name
                                                                  ] as number)
                                                                : 0
                                                        }
                                                        onChange={handleNumberChange(
                                                            field.name,
                                                        )}
                                                    />
                                                ) : (
                                                    <Input
                                                        label={field.label}
                                                        name={field.name}
                                                        labelPlacement="outside"
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        type={field.type}
                                                        isRequired={
                                                            field.required
                                                        }
                                                        errorMessage={
                                                            errors[
                                                                field.name
                                                            ] ||
                                                            field.errorMessage
                                                        }
                                                        value={
                                                            (formData[
                                                                field.name
                                                            ] as string) || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                field.name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                {t("generics.cancel")}
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                form="add-form"
                            >
                                {t("generics.add")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
