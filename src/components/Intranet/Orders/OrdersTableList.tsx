import { PaginatedOrders } from "@/types/Orders.ts";
import { useEffect, useState } from "react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared/src/collections";
import { OrdersTableListHeaders } from "@components/Intranet/Orders/OrdersTableList.headers.ts";
import { useTranslation } from "react-i18next";
import {
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import {
    orderStatusColor,
    orderStatusName,
    totalHtToTtc,
} from "@utils/utils.ts";
import { useNavigate } from "react-router";

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
}: OrdersTableListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const headers = OrdersTableListHeaders(t);
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
                                                console.log(
                                                    "Update status",
                                                    order.id,
                                                );
                                            },
                                        },
                                        {
                                            label: "Imprimer la liste des produits",
                                            variant: "default",
                                            onClick: () => {
                                                console.log(
                                                    "Update status",
                                                    order.id,
                                                );
                                            },
                                        },
                                        {
                                            label: "Imprimer la facture",
                                            variant: "default",
                                            onClick: () => {
                                                console.log(
                                                    "Update status",
                                                    order.id,
                                                );
                                            },
                                        },
                                        {
                                            label: t(
                                                "users.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: () =>
                                                console.log("delete"),
                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
