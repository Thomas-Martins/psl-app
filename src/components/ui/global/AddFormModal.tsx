import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import { FieldDefinition, isFormRow, isFormTitle } from "@/types/FormTypes";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface AddFormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    fields: FieldDefinition[];
    onSubmit: (data: Record<string, string>) => Promise<void> | void;
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
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            const initialData: Record<string, string> = {};
            fields.forEach((field) => {
                if (isFormRow(field)) {
                    field.elements.forEach((el) => {
                        initialData[el.name] = "";
                    });
                } else if (!isFormTitle(field)) {
                    initialData[field.name] = "";
                }
            });
            setFormData(initialData);
            setErrors({});
        }
    }, [isOpen, fields]);

    const handleInputChange = (name: string, value: string) => {
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
                    if (el.required && !value) {
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
                if (field.required && !value) {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            await onSubmit(formData);
            onOpenChange(false);
        }
    };

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
                                                                            value={
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
                                                        ) : (
                                                            <Input
                                                                label={el.label}
                                                                name={el.name}
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
                                                                    formData[
                                                                        el.name
                                                                    ] || ""
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
                                    return (
                                        <div key={field.name} className="mb-4">
                                            {field.type === "select" ? (
                                                <Select
                                                    label={field.label}
                                                    name={field.name}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    isRequired={field.required}
                                                    aria-label={field.label}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLSelectElement>,
                                                    ) =>
                                                        handleInputChange(
                                                            field.name,
                                                            event.target.value,
                                                        )
                                                    }
                                                >
                                                    {field.options?.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ),
                                                    ) ?? null}
                                                </Select>
                                            ) : (
                                                <Input
                                                    label={field.label}
                                                    name={field.name}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    type={field.type}
                                                    isRequired={field.required}
                                                    errorMessage={
                                                        errors[field.name] ||
                                                        field.errorMessage
                                                    }
                                                    value={
                                                        formData[field.name] ||
                                                        ""
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
