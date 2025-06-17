import {
    addToast,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { Customer } from "@/types/Customers.ts";
import CustomerOrdersTableList from "@components/Intranet/Clients/CustomerOrdersTableList.tsx";

export default function CustomerDetailDrawer() {
    const { customerId } = useParams<{ customerId: string }>();
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer>();

    const fetchCustomer = useCallback(async () => {
        if (!customerId) return;
        try {
            const response = await UsersProvider.getUser(Number(customerId), {
                withOrders: true,
            });
            setCustomer(response.data.data);
            onOpen();
        } catch (error) {
            console.error("Error fetching customer:", error);
            addToast({
                color: "danger",
                title: t("customer.details.errors.get_customer"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
                hideIcon: true,
            });
            navigate("/customers");
        }
    }, [customerId, navigate, onOpen, t]);

    useEffect(() => {
        if (customerId) {
            fetchCustomer().then();
        }
    }, [customerId, fetchCustomer]);

    return (
        <>
            <Drawer
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="xl"
                hideCloseButton={true}
                onClose={() => {
                    navigate(-1);
                }}
            >
                {customer && (
                    <DrawerContent>
                        <DrawerHeader>
                            <h1 className="text-2xl font-bold">
                                {customer.identity}
                            </h1>
                        </DrawerHeader>
                        <DrawerBody>
                            <div>
                                <h3 className="underline font-medium text-md">
                                    {t("customer.details.informations")}
                                </h3>
                                <div className="flex flex-col gap-2 mt-4 text-zinc-500">
                                    <p>
                                        <span>
                                            {t("customer.details.email")} :
                                        </span>
                                        {" " + customer.email}
                                    </p>
                                    <p>
                                        <span>
                                            {t("customer.details.phone")} :
                                        </span>
                                        {" " + customer.phone}
                                    </p>
                                    <p>
                                        <span>
                                            {t("customer.details.address")} :
                                        </span>
                                        {" " + customer.full_address}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="underline font-medium text-md">
                                    {t("customer.details.history")}
                                </h3>
                                <CustomerOrdersTableList
                                    orders={customer.orders}
                                />
                            </div>
                        </DrawerBody>
                    </DrawerContent>
                )}
            </Drawer>
        </>
    );
}
