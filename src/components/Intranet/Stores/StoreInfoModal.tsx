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

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-row items-center gap-3">
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
            </ModalContent>
        </Modal>
    );
}
