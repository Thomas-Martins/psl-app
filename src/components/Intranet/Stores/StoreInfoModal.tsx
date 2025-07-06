import StoresProvider from "@/core/api/Providers/StoresProvider";
import {
    addToast,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Store } from "@/types/Stores.ts";
import { useTranslation } from "react-i18next";
import { CircularProgress } from "@heroui/react";

interface StoresInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function StoreInfoModal({
    isOpen,
    onOpenChange,
}: StoresInfoModalProps) {
    const { t } = useTranslation();
    const { storeId } = useParams<{ storeId: string }>();
    const navigate = useNavigate();
    const effectiveIsOpen = Boolean(storeId) || isOpen;

    const [store, setStore] = useState<Store | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const fetchStore = useCallback(async () => {
        if (!storeId) return;
        try {
            const response = await StoresProvider.getStore(storeId);
            setStore(response.data.data);
        } catch (error) {
            console.error("Error fetching store:", error);
            navigate("/stores");
            addToast({
                title: t("generics.errors.surprise"),
                color: "danger",
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
        }
    }, [storeId, navigate, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/stores");
        }
        onOpenChange(open);
    };

    useEffect(() => {
        if (storeId) {
            (async () => {
                await fetchStore();
            })();
        }
    }, [storeId, fetchStore]);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [storeId]);

    useEffect(() => {
        if (store && store.image_url && !imageLoaded && !imageError) {
            const timeout = setTimeout(() => setImageLoaded(true), 1000); // 1s
            return () => clearTimeout(timeout);
        }
    }, [store, imageLoaded, imageError]);

    const isLoading = !store || (store.image_url && !imageLoaded);

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
                            <h2>{store?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <h3 className="underline font-medium">
                                {t("stores.add.inputs.title")}
                            </h3>
                            <div className="text-light-500 text-sm flex flex-row gap-8">
                                <div className="space-y-2">
                                    <p> {t("stores.add.inputs.email")}:</p>
                                    <p> {t("stores.add.inputs.phone")}:</p>
                                    <p> {t("stores.add.inputs.address")}:</p>
                                    <p> {t("stores.add.inputs.siret")}:</p>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <p>{store?.email}</p>
                                    <p>{store?.phone}</p>
                                    <p>{store?.full_address}</p>
                                    <p>{store?.siret}</p>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
