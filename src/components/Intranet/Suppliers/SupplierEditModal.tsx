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
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { validators } from "@utils/InputForm.validators";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import { PaginatedSuppliers } from "@/types/Suppliers.ts";

interface SupplierEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

interface OutletContext {
    mutate: () => Promise<PaginatedSuppliers | undefined>;
}

export default function SupplierEditModal({
    isOpen,
    onOpenChange,
}: SupplierEditModalProps) {
    const { mutate } = useOutletContext<OutletContext>();
    const { supplierId } = useParams<{ supplierId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(supplierId) || isOpen;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        zipcode: "",
        city: "",
        contact_person_firstname: "",
        contact_person_lastname: "",
        contact_person_email: "",
        contact_person_phone: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleClose = useCallback(() => {
        onOpenChange(false);
        navigate("/suppliers");
    }, [onOpenChange, navigate]);

    const init = useCallback(async () => {
        if (!supplierId) {
            addToast({
                color: "danger",
                title: t("suppliers.edit.alert.error"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
            handleClose();
            return;
        }
        try {
            const response = await SuppliersProvider.getSupplier(supplierId);
            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
                phone: response.data.phone || "",
                address: response.data.address || "",
                zipcode: response.data.zipcode || "",
                city: response.data.city || "",
                contact_person_firstname:
                    response.data.contact_person_firstname || "",
                contact_person_lastname:
                    response.data.contact_person_lastname || "",
                contact_person_email: response.data.contact_person_email || "",
                contact_person_phone: response.data.contact_person_phone || "",
            });
        } catch (e) {
            console.error("Error fetching supplier data:", e);
            addToast({
                color: "danger",
                title: t("suppliers.edit.alert.error"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
            handleClose();
        }
    }, [handleClose, supplierId, t]);

    useEffect(() => {
        init();
    }, [init]);

    const fieldValidatorMapping: Record<string, string> = {
        name: "name",
        email: "email",
        phone: "phone",
        address: "address",
        zipcode: "zipcode",
        city: "city",
        contact_person_firstname: "firstname",
        contact_person_lastname: "lastname",
        contact_person_email: "email",
        contact_person_phone: "phone",
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
        console.log("Erreurs après validation globale :", newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        if (!supplierId) {
            addToast({
                color: "danger",
                title: t("suppliers.edit.alert.error"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
            return;
        }
        try {
            setIsSubmitting(true);
            await SuppliersProvider.updateSupplier(supplierId, formData);
            await mutate();
            addToast({
                color: "success",
                title: t("suppliers.edit.alert.success"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
            navigate(`/suppliers/${supplierId}`);
        } catch (error) {
            console.error("Error updating supplier:", error);
            addToast({
                color: "danger",
                title: t("suppliers.edit.alert.error"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setIsSubmitting(false);
        }
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
                            <h2>{t("suppliers.edit.title")}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <h3 className="underline font-medium">
                                    {t("suppliers.add.inputs.title")}
                                </h3>
                                <Input
                                    label={t("suppliers.add.inputs.name")}
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    errorMessage={errors.name}
                                    isInvalid={!!errors.name}
                                />
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        label={t("suppliers.add.inputs.email")}
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
                                        label={t("suppliers.add.inputs.phone")}
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
                                    label={t("suppliers.add.inputs.address")}
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                    errorMessage={errors.address}
                                    isInvalid={!!errors.address}
                                />
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        label={t(
                                            "suppliers.add.inputs.zipcode",
                                        )}
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
                                        label={t("suppliers.add.inputs.city")}
                                        value={formData.city}
                                        onChange={(e) =>
                                            handleChange("city", e.target.value)
                                        }
                                        errorMessage={errors.city}
                                        isInvalid={!!errors.city}
                                    />
                                </div>
                                <h3 className="underline font-medium">
                                    {t("suppliers.add.inputs.subtitle")}
                                </h3>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        label={t(
                                            "suppliers.add.inputs.contact_person_lastname",
                                        )}
                                        value={formData.contact_person_lastname}
                                        onChange={(e) =>
                                            handleChange(
                                                "contact_person_lastname",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={
                                            errors.contact_person_lastname
                                        }
                                        isInvalid={
                                            !!errors.contact_person_lastname
                                        }
                                    />
                                    <Input
                                        label={t(
                                            "suppliers.add.inputs.contact_person_firstname",
                                        )}
                                        value={
                                            formData.contact_person_firstname
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                "contact_person_firstname",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={
                                            errors.contact_person_firstname
                                        }
                                        isInvalid={
                                            !!errors.contact_person_firstname
                                        }
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        label={t(
                                            "suppliers.add.inputs.contact_person_email",
                                        )}
                                        value={formData.contact_person_email}
                                        onChange={(e) =>
                                            handleChange(
                                                "contact_person_email",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={
                                            errors.contact_person_email
                                        }
                                        isInvalid={
                                            !!errors.contact_person_email
                                        }
                                    />
                                    <Input
                                        label={t(
                                            "suppliers.add.inputs.contact_person_phone",
                                        )}
                                        value={formData.contact_person_phone}
                                        onChange={(e) =>
                                            handleChange(
                                                "contact_person_phone",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={
                                            errors.contact_person_phone
                                        }
                                        isInvalid={
                                            !!errors.contact_person_phone
                                        }
                                    />
                                </div>
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
