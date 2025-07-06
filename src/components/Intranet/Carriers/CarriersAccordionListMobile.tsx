import { useTranslation } from "react-i18next";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { Carrier } from "@/types/Carriers";
import { useNavigate } from "react-router";
import CarriersProvider from "@core/api/Providers/CarriersProvider";
import { Action } from "@utils/Action";
import { addToast } from "@heroui/react";

interface CarriersAccordionListMobileProps {
    carriers: Carrier[];
    isLoading: boolean;
    mutate?: () => Promise<unknown>;
}

export default function CarriersAccordionListMobile({
    carriers,
    isLoading,
    mutate,
}: CarriersAccordionListMobileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDeleteCarrier = async (carrier: Carrier) => {
        try {
            await CarriersProvider.deleteCarrier(carrier.id);
            if (mutate) await mutate();
            addToast({
                color: "success",
                title: t("carriers.table.actions.delete.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (e) {
            console.error(e);
            addToast({
                color: "danger",
                title: t("carriers.table.actions.delete.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    return (
        <GenericAccordionListMobile
            items={carriers}
            isLoading={isLoading}
            getKey={(carrier) => carrier.id}
            getHeaderContent={(carrier) => (
                <div>
                    <span className="font-semibold text-base">
                        {carrier.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {carrier.email}
                    </div>
                </div>
            )}
            getBodyContent={(carrier) => (
                <div className="space-y-1">
                    <div>
                        <span className="font-medium">
                            {t("carriers.table.headers.contact")}:{" "}
                        </span>
                        {carrier.contact_person_firstname}{" "}
                        {carrier.contact_person_lastname} (
                        {carrier.contact_person_email})
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("carriers.table.headers.phone")}:{" "}
                        </span>
                        {carrier.phone}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("carriers.table.headers.address")}:{" "}
                        </span>
                        {carrier.address}, {carrier.zipcode} {carrier.city}
                    </div>
                </div>
            )}
            getActions={(carrier) => [
                {
                    label: t("carriers.table.actions.edit"),
                    variant: "default",
                    onClick: () => {
                        navigate(`/carriers/${carrier.id}/edit`);
                    },
                },
                {
                    label: t("carriers.table.actions.delete.title"),
                    variant: "danger",
                    onClick: Action.create(async () => {
                        await handleDeleteCarrier(carrier);
                    })
                        .confirm(
                            t("carriers.table.actions.delete.dialog.title"),
                            t("carriers.table.actions.delete.dialog.message", {
                                name: carrier.name,
                            }),
                            "danger",
                            t("carriers.table.actions.delete.dialog.confirm"),
                            t("generics.cancel"),
                        )
                        .build(),
                },
            ]}
            showViewButton={true}
            onView={(carrier) => navigate(`/carriers/${carrier.id}`)}
        />
    );
}
