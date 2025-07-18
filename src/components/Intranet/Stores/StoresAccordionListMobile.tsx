import { useTranslation } from "react-i18next";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { Store } from "@/types/Stores";
import { useNavigate } from "react-router";
import StoresProvider from "@core/api/Providers/StoresProvider";
import { Action } from "@utils/Action";
import { addToast } from "@heroui/react";

interface StoresAccordionListMobileProps {
    stores: Store[];
    isLoading: boolean;
    mutate?: () => Promise<unknown>;
}

export default function StoresAccordionListMobile({
    stores,
    isLoading,
    mutate,
}: StoresAccordionListMobileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDeleteStore = async (store: Store) => {
        try {
            await StoresProvider.deleteStore(store.id);
            if (mutate) await mutate();
            addToast({
                title: t("stores.table.actions.delete.success"),
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("stores.table.actions.delete.error"),
                color: "danger",
            });
        }
    };

    return (
        <GenericAccordionListMobile
            items={stores}
            isLoading={isLoading}
            emptyContent={t("stores.table.empty")}
            getKey={(store) => store.id}
            getHeaderContent={(store) => (
                <div>
                    <span className="font-semibold text-base">
                        {store.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {store.email}
                    </div>
                </div>
            )}
            getBodyContent={(store) => (
                <div>
                    <div>
                        <span className="font-medium">
                            {t("stores.table.headers.address")}:{" "}
                        </span>
                        {store.address}, {store.zipcode} {store.city}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("stores.table.headers.phone")}:{" "}
                        </span>
                        {store.phone}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("stores.table.headers.customers_count")}:{" "}
                        </span>
                        {store.customers_count}
                    </div>
                    <div>
                        <span className="font-medium">SIRET: </span>
                        {store.siret}
                    </div>
                </div>
            )}
            getActions={(store) => [
                {
                    label: t("stores.table.actions.edit"),
                    variant: "default",
                    onClick: () => {
                        navigate(`/stores/${store.id}/edit`, {
                            state: { store },
                        });
                    },
                },
                {
                    label: t("stores.table.actions.delete.title"),
                    variant: "danger",
                    onClick: Action.create(async () => {
                        await handleDeleteStore(store);
                    })
                        .confirm(
                            t("stores.table.actions.delete.dialog.title"),
                            t("stores.table.actions.delete.dialog.message", {
                                name: store.name,
                            }),
                            "danger",
                            t("stores.table.actions.delete.dialog.confirm"),
                            t("generics.cancel"),
                        )
                        .build(),
                },
            ]}
            showViewButton={true}
            onView={(store) => navigate(`/stores/${store.id}`)}
        />
    );
}
