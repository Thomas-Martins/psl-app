import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import StoresProvider from "@/core/api/Providers/StoresProvider";
import { useTranslation } from "react-i18next";
import { validators } from "@utils/InputForm.validators";

interface StoreEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function StoreEditModal({
    isOpen,
    onOpenChange,
}: StoreEditModalProps) {
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(storeId) || isOpen;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        zipcode: "",
        city: "",
        siret: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const init = useCallback(() => {
        setFormData({
            name: state.store.name || "",
            email: state.store.email || "",
            phone: state.store.phone || "",
            address: state.store.address || "",
            zipcode: state.store.zipcode || "",
            city: state.store.city || "",
            siret: state.store.siret || "",
        });
    }, [state?.store]);

    useEffect(() => {
        if (state?.store) {
            init();
        }
    }, [state?.store, init]);

    const fieldValidatorMapping: Record<string, string> = {
        name: "name",
        email: "email",
        phone: "phone",
        address: "address",
        zipcode: "zipcode",
        city: "city",
        siret: "siret",
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        const validatorKey = fieldValidatorMapping[field];
        if (validatorKey && validators[validatorKey]) {
            const error = validators[validatorKey](value);
            setErrors((prev) => ({
                ...prev,
                [field]: error || "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach((field) => {
            const validatorKey = fieldValidatorMapping[field];
            if (validatorKey && validators[validatorKey]) {
                const error = validators[validatorKey](
                    formData[field as keyof typeof formData],
                );
                if (error) {
                    newErrors[field] = error;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            setIsSubmitting(true);
            if (!storeId) {
                return;
            }
            await StoresProvider.updateStore(storeId, formData);
            addToast({
                color: "success",
                title: t("stores.edit.alert.success"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
            navigate(`/stores/${storeId}`);
        } catch (error) {
            console.error("Error updating store:", error);
            addToast({
                color: "danger",
                title: t("stores.edit.alert.error"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        navigate("/stores");
    };

    return (
        <Modal
            size="2xl"
            isOpen={effectiveIsOpen}
            onOpenChange={(open) => {
                if (!open) handleClose();
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h2>{t("stores.edit.title")}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <h3 className="underline font-medium">
                                    {t("stores.add.inputs.title")}
                                </h3>
                                <Input
                                    label={t("stores.add.inputs.name")}
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    errorMessage={errors.name}
                                    isInvalid={!!errors.name}
                                />
                                <div className="flex space-x-4">
                                    <Input
                                        label={t("stores.add.inputs.email")}
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.email}
                                        isInvalid={!!errors.email}
                                    />
                                    <Input
                                        label={t("stores.add.inputs.phone")}
                                        value={formData.phone}
                                        onChange={(e) =>
                                            handleChange(
                                                "phone",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.phone}
                                        isInvalid={!!errors.phone}
                                    />
                                </div>
                                <Input
                                    label={t("stores.add.inputs.address")}
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                    errorMessage={errors.address}
                                    isInvalid={!!errors.address}
                                />
                                <div className="flex space-x-4">
                                    <Input
                                        label={t("stores.add.inputs.zipcode")}
                                        value={formData.zipcode}
                                        onChange={(e) =>
                                            handleChange(
                                                "zipcode",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.zipcode}
                                        isInvalid={!!errors.zipcode}
                                    />
                                    <Input
                                        label={t("stores.add.inputs.city")}
                                        value={formData.city}
                                        onChange={(e) =>
                                            handleChange("city", e.target.value)
                                        }
                                        errorMessage={errors.city}
                                        isInvalid={!!errors.city}
                                    />
                                </div>
                                <Input
                                    label={t("stores.add.inputs.siret")}
                                    value={formData.siret}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                    errorMessage={errors.siret}
                                    isInvalid={!!errors.siret}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => {
                                    onClose();
                                    handleClose();
                                }}
                            >
                                {t("generics.cancel")}
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSubmit}
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                {t("generics.save")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
