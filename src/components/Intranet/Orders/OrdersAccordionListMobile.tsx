import { PaginatedOrders } from "@/types/Orders";
import { useTranslation } from "react-i18next";
import {
    Accordion,
    AccordionItem,
    Chip,
    CircularProgress,
} from "@heroui/react";
import { orderStatusColor, orderStatusName, totalHtToTtc } from "@utils/utils";
import ThreeDotMenu from "@components/tools/ThreeDotMenu";
import i18n from "@core/i18n/i18n";
import OrdersProvider from "@core/api/Providers/OrdersProvider";
import { saveAs } from "file-saver";
import { useState } from "react";
import OrderStatusModal from "@components/Intranet/Orders/OrderStatusModal";

interface OrdersAccordionListMobileProps {
    orders: PaginatedOrders;
    isLoading: boolean;
    mutate: () => Promise<PaginatedOrders | undefined>;
}

export default function OrdersAccordionListMobile({
    orders,
    isLoading,
    mutate,
}: OrdersAccordionListMobileProps) {
    const { t } = useTranslation();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [statusModalOrder, setStatusModalOrder] = useState<null | {
        id: string;
        status: string;
        reference: string;
    }>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <CircularProgress
                    aria-label="loader"
                    className="stroke-primary-500"
                />
            </div>
        );
    }

    if (!orders.data || orders.data.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                {t("orders.empty")}
            </div>
        );
    }

    return (
        <>
            <Accordion variant="shadow" className="w-full">
                {orders.data.map((order) => (
                    <AccordionItem
                        key={order.id}
                        title={
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-base">
                                    #{order.reference} - {order.user.identity}
                                </span>
                                <Chip
                                    color={orderStatusColor(order.status)}
                                    variant="flat"
                                    className="mt-1"
                                >
                                    {orderStatusName(order.status)}
                                </Chip>
                            </div>
                        }
                    >
                        <div className="space-y-2 py-2">
                            <div>
                                <span className="font-medium">
                                    {t("orders.table.headers.date_delivery")}
                                    :{" "}
                                </span>
                                {order.estimated_delivery_date || "-"}
                            </div>
                            <div>
                                <span className="font-medium">
                                    {t("orders.table.headers.address")}:{" "}
                                </span>
                                {order.user.store.address}
                            </div>
                            <div>
                                <span className="font-medium">
                                    {t("orders.table.headers.products_count")}
                                    :{" "}
                                </span>
                                {order.total_quantity}
                            </div>
                            <div>
                                <span className="font-medium">
                                    {t("orders.table.headers.total_ht")}:{" "}
                                </span>
                                {totalHtToTtc(order.total_price, 20)}€
                            </div>
                            <div className="pt-2 flex justify-end">
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "orders.table.actions.update_status",
                                            ),
                                            variant: "default",
                                            onClick: () => {
                                                setStatusModalOrder({
                                                    id: order.id,
                                                    status: order.status as import("@/types/OrderStatus").OrderStatus,
                                                    reference: order.reference,
                                                });
                                            },
                                        },
                                        {
                                            label: t(
                                                "orders.table.actions.print.products_lists",
                                            ),
                                            variant: "default",
                                            onClick: () => {
                                                console.log(
                                                    "Print products lists",
                                                    order.id,
                                                );
                                            },
                                        },
                                        {
                                            label: t(
                                                "orders.table.actions.print.invoice",
                                            ),
                                            variant: "default",
                                            onClick: async () => {
                                                setLoadingId(order.id);
                                                try {
                                                    const payload = {
                                                        locale: i18n.language,
                                                    };
                                                    const response =
                                                        await OrdersProvider.downloadInvoice(
                                                            order.id,
                                                            {},
                                                            payload,
                                                        );
                                                    const blob = new Blob(
                                                        [response.data],
                                                        {
                                                            type: "application/pdf",
                                                        },
                                                    );
                                                    saveAs(
                                                        blob,
                                                        `facture-${order.reference}.pdf`,
                                                    );
                                                } catch {
                                                    // Optionally: show error toast
                                                } finally {
                                                    setLoadingId(null);
                                                }
                                            },
                                        },
                                    ]}
                                />
                                {loadingId === order.id && (
                                    <CircularProgress
                                        size="sm"
                                        className="ml-2 inline-block align-middle"
                                    />
                                )}
                            </div>
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
            {statusModalOrder && (
                <OrderStatusModal
                    isOpen={!!statusModalOrder}
                    onOpenChange={() => setStatusModalOrder(null)}
                    orderId={statusModalOrder.id}
                    currentStatus={
                        statusModalOrder.status as import("@/types/OrderStatus").OrderStatus
                    }
                    orderReference={statusModalOrder.reference}
                    onStatusUpdated={mutate}
                />
            )}
        </>
    );
}
