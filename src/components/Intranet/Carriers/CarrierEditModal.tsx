import {
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
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useTranslation } from "react-i18next";
import { validators } from "@utils/InputForm.validators";

interface CarrierEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function CarrierEditModal({
    isOpen,
    onOpenChange,
}: CarrierEditModalProps) {
    const { carrierId } = useParams<{ carrierId: string }>();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useTranslation();
    const { setAlert } = useGlobalAlert();
    const effectiveIsOpen = Boolean(carrierId) || isOpen;
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

    const init = useCallback(() => {
        setFormData({
            name: state.carrier.name || "",
            email: state.carrier.email || "",
            phone: state.carrier.phone || "",
            address: state.carrier.address || "",
            zipcode: state.carrier.zipcode || "",
            city: state.carrier.city || "",
            contact_person_firstname:
                state.carrier.contact_person_firstname || "",
            contact_person_lastname:
                state.carrier.contact_person_lastname || "",
            contact_person_email: state.carrier.contact_person_email || "",
            contact_person_phone: state.carrier.contact_person_phone || "",
        });
    }, [state?.carrier]);

    useEffect(() => {
        if (state?.carrier) {
            init();
        }
    }, [state?.carrier, init]);

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
        try {
            setIsSubmitting(true);
            await CarriersProvider.updateCarrier(state.carrier.id, formData);
            setAlert({
                type: "success",
                title: t("carriers.edit.alert.success"),
            });
            navigate(`/carriers/${carrierId}`);
        } catch (error) {
            console.error("Error updating carrier:", error);
            setAlert({
                type: "danger",
                title: t("carriers.edit.alert.error"),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        navigate("/carriers");
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
                            <h2>{t("carriers.edit.title")}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <h3 className="underline font-medium">
                                    {t("carriers.add.inputs.title")}
                                </h3>
                                <Input
                                    label={t("carriers.add.inputs.name")}
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    errorMessage={errors.name}
                                    isInvalid={!!errors.name}
                                />
                                <div className="flex space-x-4">
                                    <Input
                                        label={t("carriers.add.inputs.email")}
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
                                        label={t("carriers.add.inputs.phone")}
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
                                    label={t("carriers.add.inputs.address")}
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                    errorMessage={errors.address}
                                    isInvalid={!!errors.address}
                                />
                                <div className="flex space-x-4">
                                    <Input
                                        label={t("carriers.add.inputs.zipcode")}
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
                                        label={t("carriers.add.inputs.city")}
                                        value={formData.city}
                                        onChange={(e) =>
                                            handleChange("city", e.target.value)
                                        }
                                        errorMessage={errors.city}
                                        isInvalid={!!errors.city}
                                    />
                                </div>
                                <h3 className="underline font-medium">
                                    {t("carriers.add.inputs.subtitle")}
                                </h3>
                                <div className="flex space-x-4">
                                    <Input
                                        label={t(
                                            "carriers.add.inputs.contact_person_lastname",
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
                                            "carriers.add.inputs.contact_person_firstname",
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
                                <div className="flex space-x-4">
                                    <Input
                                        label={t(
                                            "carriers.add.inputs.contact_person_email",
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
                                            "carriers.add.inputs.contact_person_phone",
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
