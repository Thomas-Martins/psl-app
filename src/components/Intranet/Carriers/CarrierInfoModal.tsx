import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { Carrier } from "@/types/Carriers.ts";
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useTranslation } from "react-i18next";

interface CarrierInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function CarrierInfoModal({
    isOpen,
    onOpenChange,
}: CarrierInfoModalProps) {
    const { carrierId } = useParams<{ carrierId: string }>();
    const { setAlert } = useGlobalAlert();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(carrierId) || isOpen;

    const [carrier, setCarrier] = useState<Carrier | null>(null);

    const fetchCarrier = useCallback(async () => {
        if (!carrierId) return;
        const id = parseInt(carrierId, 10);
        if (isNaN(id)) {
            console.error("carrierId is not a valid number:", carrierId);
            navigate("/carriers");
            setAlert({
                type: "danger",
                title: t("carriers.errors.get_carrier"),
            });
            return;
        }
        try {
            const response = await CarriersProvider.getCarrier(id);
            setCarrier(response.data);
        } catch (error) {
            console.error("Error fetching carrier:", error);
            navigate("/carriers");
            setAlert({
                type: "danger",
                title: t("carriers.errors.get_carrier"),
            });
        }
    }, [carrierId, navigate, setAlert, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/carriers");
        }
        onOpenChange(open);
    };

    const handleEditClick = () => {
        if (carrierId) {
            navigate(`/carriers/${carrierId}/edit`, {
                state: { carrier: carrier },
            });
        }
    };

    useEffect(() => {
        if (carrierId) {
            (async () => {
                await fetchCarrier();
            })();
        }
    }, [carrierId, fetchCarrier]);

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-row items-center gap-3">
                    <h2>{carrier?.name}</h2>
                </ModalHeader>
                <ModalBody>
                    <h3 className="underline font-medium">
                        {t("carriers.add.inputs.title")}
                    </h3>
                    <div className="text-light-500 text-sm flex flex-row gap-8">
                        <div className="space-y-2">
                            <p> {t("carriers.add.inputs.email")}:</p>
                            <p> {t("carriers.add.inputs.phone")}:</p>
                            <p> {t("carriers.add.inputs.address")}:</p>
                        </div>
                        <div className="space-y-2">
                            <p>{carrier?.email}</p>
                            <p>{carrier?.phone}</p>
                            <p>
                                {carrier?.address +
                                    ", " +
                                    carrier?.zipcode +
                                    ", " +
                                    carrier?.city}
                            </p>
                        </div>
                    </div>
                    <h3 className="underline font-medium">
                        {t("carriers.add.inputs.subtitle")}
                    </h3>
                    <div className="text-light-500 text-sm flex flex-row gap-8">
                        <div className="space-y-2">
                            <p>
                                {" "}
                                {t(
                                    "carriers.add.inputs.contact_person_identity",
                                )}
                                :
                            </p>
                            <p> {t("carriers.add.inputs.email")}:</p>
                            <p> {t("carriers.add.inputs.phone")}:</p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                {carrier?.contact_person_firstname +
                                    " " +
                                    carrier?.contact_person_lastname}
                            </p>
                            <p>{carrier?.contact_person_email}</p>
                            <p>{carrier?.contact_person_phone}</p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={handleEditClick}>
                        {t("generics.edit")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
