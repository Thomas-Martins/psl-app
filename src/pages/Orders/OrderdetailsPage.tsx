import { useNavigate, useParams } from "react-router";
import BackButton from "@components/tools/BackButton.tsx";
import { useEffect, useState } from "react";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import { Order } from "@/types/Orders.ts";
import {
    addToast,
    Chip,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";
import { orderStatusColor, orderStatusName } from "@utils/utils.ts";
import { OrderStatus } from "@/types/OrderStatus.ts";
import OrderProductTableList from "@components/Intranet/Orders/OrderProductTableList.tsx";
import { useTranslation } from "react-i18next";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order>();

    const fetchOrderDetails = async (orderId: string) => {
        return await OrdersProvider.getOrder(Number(orderId));
    };

    useEffect(() => {
        let isComponentMounted = true;

        if (id) {
            fetchOrderDetails(id)
                .then((response) => {
                    setOrder(response.data.data);
                    onOpen();
                })
                .catch((error) => {
                    console.error(error);
                    if (isComponentMounted) {
                        addToast({
                            title: t("generics.errors.surprise"),
                            color: "danger",
                            timeout: 2000,
                            shouldShowTimeoutProgress: true,
                        });
                        navigate("/orders", { replace: true });
                    }
                });
        }
        return () => {
            isComponentMounted = false;
        };
    }, [id, onOpen, onClose, navigate, t]);

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
                <DrawerContent>
                    <DrawerHeader className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <BackButton />
                            <div className="flex items-center gap-6 ">
                                <h1 className="text-xl font-bold">
                                    {t("orders.details._name") +
                                        " #" +
                                        order?.reference}
                                </h1>
                                <Chip
                                    color={orderStatusColor(
                                        order?.status || OrderStatus.PENDING,
                                    )}
                                >
                                    {order?.status &&
                                        orderStatusName(order.status)}
                                </Chip>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-normal">
                                {t("customer._name") +
                                    " : " +
                                    order?.user.identity}
                            </p>
                            <p className="text-sm font-normal">
                                {t("orders.details.delivery.estimated") +
                                    " : " +
                                    order?.estimated_delivery_date}
                            </p>
                            <p className="text-sm font-normal">
                                {t("orders.details.delivery.address") +
                                    " : " +
                                    order?.user.store.address}
                            </p>
                        </div>
                    </DrawerHeader>
                    <DrawerBody>
                        <h2 className="text-md underline font-semibold">
                            {t("orders.details.products.title")}
                        </h2>
                        {order?.products && order.products.length > 0 && (
                            <OrderProductTableList products={order?.products} />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
