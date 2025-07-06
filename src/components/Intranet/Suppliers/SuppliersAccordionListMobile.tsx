import { useTranslation } from "react-i18next";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { Supplier } from "@/types/Suppliers";
import { useNavigate } from "react-router";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider";
import { Action } from "@utils/Action";
import { addToast } from "@heroui/react";

interface SuppliersAccordionListMobileProps {
    suppliers: Supplier[];
    isLoading: boolean;
    mutate?: () => Promise<unknown>;
}

export default function SuppliersAccordionListMobile({
    suppliers,
    isLoading,
    mutate,
}: SuppliersAccordionListMobileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDeleteSupplier = async (supplier: Supplier) => {
        try {
            await SuppliersProvider.deleteSupplier(supplier.id);
            if (mutate) await mutate();
            addToast({
                color: "success",
                title: t("suppliers.table.actions.delete.alert.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (e) {
            console.error(e);
            addToast({
                color: "danger",
                title: t("suppliers.table.actions.delete.alert.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    return (
        <GenericAccordionListMobile
            items={suppliers}
            isLoading={isLoading}
            getKey={(supplier) => supplier.id}
            getHeaderContent={(supplier) => (
                <div>
                    <span className="font-semibold text-base">
                        {supplier.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {supplier.email}
                    </div>
                </div>
            )}
            getBodyContent={(supplier) => (
                <div className="space-y-1">
                    <div>
                        <span className="font-medium">
                            {t("suppliers.table.headers.contact")}:{" "}
                        </span>
                        {supplier.contact_person_firstname}{" "}
                        {supplier.contact_person_lastname} (
                        {supplier.contact_person_email})
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("suppliers.table.headers.phone")}:{" "}
                        </span>
                        {supplier.phone}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("suppliers.table.headers.address")}:{" "}
                        </span>
                        {supplier.address}, {supplier.zipcode} {supplier.city},{" "}
                        {supplier.country}
                    </div>
                </div>
            )}
            getActions={(supplier) => [
                {
                    label: t("suppliers.table.actions.edit"),
                    variant: "default",
                    onClick: () => {
                        navigate(`/suppliers/${supplier.id}/edit`);
                    },
                },
                {
                    label: t("suppliers.table.actions.delete.title"),
                    variant: "danger",
                    onClick: Action.create(async () => {
                        await handleDeleteSupplier(supplier);
                    })
                        .confirm(
                            t("suppliers.table.actions.delete.dialog.title"),
                            t("suppliers.table.actions.delete.dialog.message", {
                                name: supplier.name,
                            }),
                            "danger",
                            t("suppliers.table.actions.delete.dialog.confirm"),
                            t("generics.cancel"),
                        )
                        .build(),
                },
            ]}
            showViewButton={true}
            onView={(supplier) => navigate(`/suppliers/${supplier.id}`)}
        />
    );
}
