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
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useTranslation } from "react-i18next";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import { Supplier } from "@/types/Suppliers.ts";

interface SupplierInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function SupplierInfoModal({
    isOpen,
    onOpenChange,
}: SupplierInfoModalProps) {
    const { supplierId } = useParams<{ supplierId: string }>();
    const { setAlert } = useGlobalAlert();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(supplierId) || isOpen;

    const [supplier, setSupplier] = useState<Supplier | null>(null);

    const fetchSupplier = useCallback(async () => {
        if (!supplierId) return;
        const id = parseInt(supplierId, 10);
        if (isNaN(id)) {
            console.error("supplierId is not a valid number:", supplierId);
            navigate("/suppliers");
            setAlert({
                type: "danger",
                title: t("suppliers.errors.get_supplier"),
            });
            return;
        }
        try {
            const response = await SuppliersProvider.getSupplier(id);
            setSupplier(response.data);
        } catch (error) {
            console.error("Error fetching supplier:", error);
            navigate("/suppliers");
            setAlert({
                type: "danger",
                title: t("suppliers.errors.get_supplier"),
            });
        }
    }, [supplierId, navigate, setAlert, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/suppliers");
        }
        onOpenChange(open);
    };

    const handleEditClick = () => {
        if (supplierId) {
            navigate(`/suppliers/${supplierId}/edit`, {
                state: { supplier: supplier },
            });
        }
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
                <ModalHeader className="flex flex-row items-center gap-3">
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
                                {supplier?.address +
                                    ", " +
                                    supplier?.zipcode +
                                    ", " +
                                    supplier?.city}
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
                        <div className="space-y-2">
                            <p>
                                {supplier?.contact_person_firstname +
                                    " " +
                                    supplier?.contact_person_lastname}
                            </p>
                            <p>{supplier?.contact_person_email}</p>
                            <p>{supplier?.contact_person_phone}</p>
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
