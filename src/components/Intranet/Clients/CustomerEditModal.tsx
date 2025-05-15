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
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { validators } from "@utils/InputForm.validators.ts";
import { useTranslation } from "react-i18next";
import { useCustomers } from "@/contexts/Customers/CustomersContext.tsx";

interface CustomerEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function CustomerEditModal({
    isOpen,
    onOpenChange,
}: CustomerEditModalProps) {
    const { customerId } = useParams();
    const { state } = useLocation();
    const { t } = useTranslation();
    const { mutate } = useCustomers();
    const navigate = useNavigate();
    const effectiveOpen = Boolean(customerId) || isOpen;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        zipcode: "",
        city: "",
    });

    const init = useCallback(() => {
        setFormData({
            firstname: state?.customer?.firstname || "",
            lastname: state?.customer?.lastname || "",
            email: state?.customer?.email || "",
            phone: state?.customer?.phone || "",
            address: state?.customer?.address || "",
            zipcode: state?.customer?.zipcode || "",
            city: state?.customer?.city || "",
        });
    }, [state?.customer]);

    const fetchCustomer = useCallback(async () => {
        try {
            const response = await UsersProvider.getUser(Number(customerId));
            if (response.data.data) {
                setFormData({
                    firstname: response.data.data.firstname,
                    lastname: response.data.data.lastname,
                    email: response.data.data.email,
                    phone: response.data.data.phone,
                    address: response.data.data.address,
                    zipcode: response.data.data.zipcode,
                    city: response.data.data.city,
                });
            }
        } catch (e) {
            console.error(e);
            addToast({
                title: t("customer.details.errors.get_customer"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
        }
    }, [customerId, t]);

    useEffect(() => {
        if (state?.customer) {
            init();
        } else if (!state?.customer && customerId) {
            fetchCustomer().then();
        }
    }, [customerId, fetchCustomer, init, state?.customer]);

    const fieldValidatorMapping: Record<string, string> = {
        firstname: "Name",
        lastname: "Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        zipcode: "PostalCode",
        city: "City",
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
                const value = formData[field as keyof typeof formData];
                const error = validators[validatorKey](value);
                if (error) {
                    newErrors[field] = error;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        try {
            if (!customerId) return;
            await UsersProvider.updateUser(customerId, formData);
            addToast({
                title: t("customer.edit.alert.success"),
                color: "success",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
            await mutate();
            navigate("/customers");
        } catch (error) {
            console.error("Error updating customer:", error);
            addToast({
                title: t("customer.edit.alert.error"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        navigate("/customers");
    };

    return (
        <Modal
            isOpen={effectiveOpen}
            onOpenChange={(open) => {
                if (!open) handleClose();
            }}
            size="xl"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{t("customer.edit.title")}</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label={t("customer.add.inputs.firstname")}
                                    value={formData.firstname}
                                    onChange={(e) =>
                                        handleChange(
                                            "firstname",
                                            e.target.value,
                                        )
                                    }
                                    errorMessage={errors.firstname}
                                    isInvalid={!!errors.firstname}
                                />
                                <Input
                                    label={t("customer.add.inputs.lastname")}
                                    value={formData.lastname}
                                    onChange={(e) =>
                                        handleChange("lastname", e.target.value)
                                    }
                                    errorMessage={errors.lastname}
                                    isInvalid={!!errors.lastname}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label={t("customer.add.inputs.email")}
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleChange("email", e.target.value)
                                    }
                                    errorMessage={errors.email}
                                    isInvalid={!!errors.email}
                                />
                                <Input
                                    label={t("customer.add.inputs.phone")}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange("phone", e.target.value)
                                    }
                                    errorMessage={errors.phone}
                                    isInvalid={!!errors.phone}
                                />
                            </div>
                            <Input
                                label={t("customer.add.inputs.address")}
                                value={formData.address}
                                onChange={(e) =>
                                    handleChange("address", e.target.value)
                                }
                                errorMessage={errors.address}
                                isInvalid={!!errors.address}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label={t("customer.add.inputs.zipcode")}
                                    value={formData.zipcode}
                                    onChange={(e) =>
                                        handleChange("zipcode", e.target.value)
                                    }
                                    errorMessage={errors.zipcode}
                                    isInvalid={!!errors.zipcode}
                                />
                                <Input
                                    label={t("customer.add.inputs.city")}
                                    value={formData.city}
                                    onChange={(e) =>
                                        handleChange("city", e.target.value)
                                    }
                                    errorMessage={errors.city}
                                    isInvalid={!!errors.city}
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
