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
    }, [state.carrier]);

    useEffect(() => {
        if (state.carrier) {
            init();
        }
    }, [state.carrier, init]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            await CarriersProvider.updateCarrier(state.carrier.id, formData);
            setAlert({
                type: "success",
                title: t("carriers.edit.alert.success"),
            });
            navigate(`/carriers/${carrierId}`);
        } catch {
            setAlert({
                type: "danger",
                title: t("carriers.edit.alert.error"),
            });
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
                                    />
                                </div>
                                <Input
                                    label={t("carriers.add.inputs.address")}
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
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
                                    />
                                    <Input
                                        label={t("carriers.add.inputs.city")}
                                        value={formData.city}
                                        onChange={(e) =>
                                            handleChange("city", e.target.value)
                                        }
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
                            <Button color="primary" onPress={handleSubmit}>
                                {t("generics.save")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
