import { Order } from "@/types/Orders";
import {
    Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import { orderStatusColor, orderStatusName } from "@utils/utils.ts";
import { useTranslation } from "react-i18next";

interface CustomerOrdersTableListProps {
    orders: Order[];
}

export default function CustomerOrdersTableList({
    orders,
}: CustomerOrdersTableListProps) {
    const { t } = useTranslation();
    return (
        <div>
            {orders && orders.length > 0 ? (
                <Table removeWrapper aria-label="customer-orders-list">
                    <TableHeader>
                        <TableColumn>
                            {t("customer.details.headers.orders")}
                        </TableColumn>
                        <TableColumn>
                            {t("customer.details.headers.products_count")}
                        </TableColumn>
                        <TableColumn>
                            {t("customer.details.headers.total_ht")}
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order: Order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div className="flex gap-2 items-center">
                                        <h3 className="text-md">
                                            #{order.reference}
                                        </h3>
                                        <Chip
                                            variant="flat"
                                            color={orderStatusColor(
                                                order.status,
                                            )}
                                        >
                                            {orderStatusName(order.status)}
                                        </Chip>
                                    </div>
                                    <p className="text-zinc-400 text-xs">
                                        {order.invoiced
                                            ? t("customer.details.invoiced.yes")
                                            : t("customer.details.invoiced.no")}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-md">
                                        {order.total_quantity}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <p>{order.total_price} €</p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-zinc-500 text-center py-4">
                    {t("customer.details.empty_orders")}
                </p>
            )}
        </div>
    );
}
