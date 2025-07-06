import { PaginatedOrders } from "@/types/Orders";
import { useTranslation } from "react-i18next";
import { orderStatusColor, orderStatusName, totalHtToTtc } from "@utils/utils";
import i18n from "@core/i18n/i18n";
import OrdersProvider from "@core/api/Providers/OrdersProvider";
import { saveAs } from "file-saver";
import { useState } from "react";
import OrderStatusModal from "@components/Intranet/Orders/OrderStatusModal";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { Chip } from "@heroui/react";
import { useNavigate } from "react-router";

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
    const navigate = useNavigate();
    const [statusModalOrder, setStatusModalOrder] = useState<null | {
        id: string;
        status: string;
        reference: string;
    }>(null);

    return (
        <>
            <GenericAccordionListMobile
                items={orders.data || []}
                isLoading={isLoading}
                getKey={(order) => order.id}
                getHeaderContent={(order) => (
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
                )}
                getBodyContent={(order) => (
                    <div>
                        <div>
                            <span className="font-medium">
                                {t("orders.table.headers.date_delivery")}:{" "}
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
                                {t("orders.table.headers.products_count")}:{" "}
                            </span>
                            {order.total_quantity}
                        </div>
                        <div>
                            <span className="font-medium">
                                {t("orders.table.headers.total_ht")}:{" "}
                            </span>
                            {totalHtToTtc(order.total_price, 20)}€
                        </div>
                    </div>
                )}
                getActions={(order) => [
                    {
                        label: t("orders.table.actions.update_status"),
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
                        label: t("orders.table.actions.print.products_lists"),
                        variant: "default",
                        onClick: () => {
                            console.log("Print products lists", order.id);
                        },
                    },
                    {
                        label: t("orders.table.actions.print.invoice"),
                        variant: "default",
                        onClick: async () => {
                            try {
                                const payload = { locale: i18n.language };
                                const response =
                                    await OrdersProvider.downloadInvoice(
                                        order.id,
                                        {},
                                        payload,
                                    );
                                const blob = new Blob([response.data], {
                                    type: "application/pdf",
                                });
                                saveAs(blob, `facture-${order.reference}.pdf`);
                            } catch {
                                // Optionally: show error toast
                            }
                        },
                    },
                ]}
                showViewButton={true}
                onView={(order) => navigate(`/orders/${order.id}`)}
            />
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
