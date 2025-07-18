import { useTranslation } from "react-i18next";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { Customer } from "@/types/Customers";
import { useNavigate } from "react-router";
import CustomersProvider from "@core/api/Providers/CustomersProvider";
import { Action } from "@utils/Action";
import { addToast } from "@heroui/react";

interface CustomersAccordionListMobileProps {
    customers: Customer[];
    isLoading: boolean;
    mutate?: () => Promise<unknown>;
}

export default function CustomersAccordionListMobile({
    customers,
    isLoading,
    mutate,
}: CustomersAccordionListMobileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDeleteCustomer = async (customer: Customer) => {
        try {
            await CustomersProvider.deleteCustomer(customer.id);
            if (mutate) await mutate();
            addToast({
                title: t("customer.table.actions.delete.success"),
                color: "success",
                hideIcon: false,
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("customer.table.actions.delete.error"),
                color: "danger",
                hideIcon: false,
            });
        }
    };

    return (
        <GenericAccordionListMobile
            items={customers}
            isLoading={isLoading}
            emptyContent={t("customer.table.empty")}
            getKey={(customer) => customer.id}
            getHeaderContent={(customer) => (
                <div>
                    <span className="font-semibold text-base">
                        {customer.identity}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                        {customer.email}
                    </div>
                </div>
            )}
            getBodyContent={(customer) => (
                <div>
                    <div>
                        <span className="font-medium">
                            {t("customer.table.headers.phone")}:{" "}
                        </span>
                        {customer.phone}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("customer.table.headers.address")}:{" "}
                        </span>
                        {customer.store?.full_address}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("customer.table.headers.store")}:{" "}
                        </span>
                        {customer.store?.name}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("customer.table.headers.commands_count")}:{" "}
                        </span>
                        {customer.orders_count}
                    </div>
                </div>
            )}
            getActions={(customer) => [
                {
                    label: t("customer.table.actions.edit"),
                    variant: "default",
                    onClick: () => {
                        navigate(`/customers/${customer.id}/edit`, {
                            state: { customer },
                        });
                    },
                },
                {
                    label: t("customer.table.actions.delete.title"),
                    variant: "danger",
                    onClick: Action.create(async () => {
                        await handleDeleteCustomer(customer);
                    })
                        .confirm(
                            t("customer.table.actions.delete.dialog.title"),
                            t("customer.table.actions.delete.dialog.message", {
                                name:
                                    customer.firstname +
                                    " " +
                                    customer.lastname,
                            }),
                            "danger",
                            t("customer.table.actions.delete.dialog.confirm"),
                            t("generics.cancel"),
                        )
                        .build(),
                },
            ]}
            showViewButton={true}
            onView={(customer) => navigate(`/customers/${customer.id}`)}
        />
    );
}
