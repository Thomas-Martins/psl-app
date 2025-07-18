import {
    addToast,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { Carrier } from "@/types/Carriers.ts";
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@heroui/react";

interface CarrierInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function CarrierInfoModal({
    isOpen,
    onOpenChange,
}: CarrierInfoModalProps) {
    const { carrierId } = useParams<{ carrierId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(carrierId) || isOpen;

    const [carrier, setCarrier] = useState<Carrier | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const fetchCarrier = useCallback(async () => {
        if (!carrierId) return;
        try {
            const response = await CarriersProvider.getCarrier(carrierId);
            setCarrier(response.data);
        } catch (error) {
            console.error("Error fetching carrier:", error);
            navigate("/carriers");
            addToast({
                color: "danger",
                title: t("carriers.errors.get_carrier"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    }, [carrierId, navigate, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/carriers");
        }
        onOpenChange(open);
    };

    useEffect(() => {
        if (carrierId) {
            (async () => {
                await fetchCarrier();
            })();
        }
    }, [carrierId, fetchCarrier]);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [carrierId]);

    useEffect(() => {
        if (carrier && carrier.image_url && !imageLoaded && !imageError) {
            const timeout = setTimeout(() => setImageLoaded(true), 1000); // 1s
            return () => clearTimeout(timeout);
        }
    }, [carrier, imageLoaded, imageError]);

    const isLoading = !carrier || (carrier.image_url && !imageLoaded);

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalOpenChange}>
            <ModalContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-60">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <ModalHeader>
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
                                <div className="space-y-2 mb-3">
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
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
