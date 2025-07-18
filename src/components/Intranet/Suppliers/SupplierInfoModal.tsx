import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import { Supplier } from "@/types/Suppliers.ts";
import { CircularProgress } from "@heroui/react";
import { addToast } from "@heroui/react";

interface SupplierInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function SupplierInfoModal({
    isOpen,
    onOpenChange,
}: SupplierInfoModalProps) {
    const { supplierId } = useParams<{ supplierId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(supplierId) || isOpen;

    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSupplier = useCallback(async () => {
        if (!supplierId) return;
        try {
            setIsLoading(true);
            const response = await SuppliersProvider.getSupplier(supplierId);
            setSupplier(response.data);
        } catch (error) {
            console.error("Error fetching supplier:", error);
            navigate("/suppliers");
            addToast({
                title: t("suppliers.errors.get_supplier"),
                color: "danger",
            });
        } finally {
            setIsLoading(false);
        }
    }, [supplierId, navigate, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/suppliers");
        }
        onOpenChange(open);
    };

    useEffect(() => {
        if (supplierId) {
            (async () => {
                await fetchSupplier();
            })();
        }
    }, [supplierId, fetchSupplier]);

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
                            <h2>{supplier?.name}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <h3 className="underline font-medium">
                                {t("suppliers.add.inputs.title")}
                            </h3>
                            <div className="text-light-500 text-sm flex flex-row gap-8">
                                <div className="space-y-2">
                                    <p> {t("suppliers.add.inputs.email")}:</p>
                                    <p> {t("suppliers.add.inputs.phone")}:</p>
                                    <p> {t("suppliers.add.inputs.address")}:</p>
                                </div>
                                <div className="space-y-2">
                                    <p>{supplier?.email}</p>
                                    <p>{supplier?.phone}</p>
                                    <p>
                                        {[
                                            supplier?.address,
                                            supplier?.zipcode,
                                            supplier?.city,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </p>
                                </div>
                            </div>
                            <h3 className="underline font-medium">
                                {t("suppliers.add.inputs.subtitle")}
                            </h3>
                            <div className="text-light-500 text-sm flex flex-row gap-8">
                                <div className="space-y-2">
                                    <p>
                                        {" "}
                                        {t(
                                            "suppliers.add.inputs.contact_person_identity",
                                        )}
                                        :
                                    </p>
                                    <p> {t("suppliers.add.inputs.email")}:</p>
                                    <p> {t("suppliers.add.inputs.phone")}:</p>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <p>
                                        {[
                                            supplier?.contact_person_firstname,
                                            supplier?.contact_person_lastname,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </p>
                                    <p>{supplier?.contact_person_email}</p>
                                    <p>{supplier?.contact_person_phone}</p>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
