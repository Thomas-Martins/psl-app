import { Order, PaginatedOrders } from "@/types/Orders.ts";
import { useEffect, useState } from "react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared/src/collections";
import { OrdersTableListHeaders } from "@components/Intranet/Orders/OrdersTableList.headers.ts";
import { useTranslation } from "react-i18next";
import {
    addToast,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import {
    downloadPDF,
    orderStatusColor,
    orderStatusName,
    totalHtToTtc,
} from "@utils/utils.ts";
import { useNavigate } from "react-router";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import i18n from "@core/i18n/i18n.ts";
import OrderStatusModal from "@components/Intranet/Orders/OrderStatusModal.tsx";

interface OrdersTableListProps {
    orders: PaginatedOrders;
    isLoading: boolean;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    mutate: () => Promise<PaginatedOrders | undefined>;
}
export default function OrdersTableList({
    orders,
    isLoading,
    onSortChange,
    orderBy,
    orderWay,
    mutate,
}: OrdersTableListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const headers = OrdersTableListHeaders(t);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
        column: orderBy,
        direction: orderWay === "ASC" ? "ascending" : "descending",
    });

    const handleSortChange = (descriptor: TableSortDescriptor) => {
        let newDirection: "ascending" | "descending" = "ascending";
        if (sortDescriptor && sortDescriptor.column === descriptor.column) {
            newDirection =
                sortDescriptor.direction === "ascending"
                    ? "descending"
                    : "ascending";
        }
        const newDescriptor: TableSortDescriptor = {
            column: descriptor.column,
            direction: newDirection,
        };
        setSortDescriptor(newDescriptor);

        const newOrderBy =
            typeof newDescriptor.column === "string"
                ? newDescriptor.column
                : String(newDescriptor.column);
        const newOrderWay = newDirection === "ascending" ? "ASC" : "DESC";

        onSortChange(newOrderBy, newOrderWay);
    };

    const loadingState = isLoading ? "loading" : "idle";

    useEffect(() => {
        setSortDescriptor({
            column: orderBy,
            direction: orderWay === "ASC" ? "ascending" : "descending",
        });
    }, [orderBy, orderWay]);

    const handleStatusUpdate = () => {
        mutate();
    };

    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        onOpen();
    };

    return (
        <div>
            <Table
                removeWrapper
                aria-label="users-table-list"
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
                onRowAction={(id) => {
                    navigate(`/orders/${id}`);
                }}
            >
                <TableHeader>
                    {headers.map((header) => (
                        <TableColumn
                            key={header.key}
                            allowsSorting={header.sortable}
                        >
                            {header.label}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody
                    items={orders.data ?? []}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    emptyContent={t("orders.empty")}
                    loadingState={loadingState}
                >
                    {orders.data?.map((order) => (
                        <TableRow
                            key={order.id}
                            className="hover:bg-foreground-50 cursor-pointer"
                        >
                            <TableCell>#{order.reference}</TableCell>
                            <TableCell>
                                <Chip
                                    color={orderStatusColor(order.status)}
                                    variant="flat"
                                >
                                    {orderStatusName(order.status)}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                {order.estimated_delivery_date
                                    ? order.estimated_delivery_date
                                    : "-"}
                            </TableCell>
                            <TableCell>{order.user.store.address}</TableCell>
                            <TableCell>{order.user.identity}</TableCell>
                            <TableCell>{order.total_quantity}</TableCell>
                            <TableCell>
                                {totalHtToTtc(order.total_price, 20)}€
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "orders.table.actions.update_status",
                                            ),
                                            variant: "default",
                                            onClick: () => {
                                                openStatusModal(order);
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
                                                    downloadPDF(response.data);
                                                } catch (e) {
                                                    console.error(e);
                                                    addToast({
                                                        title: t(
                                                            "generics.errors.surprise",
                                                        ),
                                                        color: "danger",
                                                        timeout: 2000,
                                                        shouldShowTimeoutProgress:
                                                            true,
                                                        hideIcon: true,
                                                    });
                                                }
                                            },
                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedOrder && (
                <OrderStatusModal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    orderId={selectedOrder.id}
                    currentStatus={selectedOrder.status}
                    orderReference={selectedOrder.reference}
                    onStatusUpdated={handleStatusUpdate}
                />
            )}
        </div>
    );
}
