import { Customer, PaginatedCustomers } from "@/types/Customers.ts";
import { useTranslation } from "react-i18next";
import { Key, useEffect, useState } from "react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared/src/collections";
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import { Action } from "@utils/Action.ts";
import CustomersProvider from "@core/api/Providers/CustomersProvider.ts";
import { CustomersTableListHeaders } from "@components/Intranet/Clients/CustomersTableList.headers.ts";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useNavigate } from "react-router";

interface CustomersTableListProps {
    customers: PaginatedCustomers;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    isLoading: boolean;
    mutate: () => Promise<PaginatedCustomers | undefined>;
}
export default function CustomersTableList({
    customers,
    onSortChange,
    orderBy,
    orderWay,
    isLoading,
    mutate,
}: CustomersTableListProps) {
    const { t } = useTranslation();
    const headers = CustomersTableListHeaders(t);
    const { setAlert } = useGlobalAlert();
    const navigate = useNavigate();

    const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
        column: orderBy,
        direction: orderWay === "ASC" ? "ascending" : "descending",
    });

    const handleRowAction = (key: Key) => {
        navigate(`/customers/${key}`);
    };

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

    const handleDeleteCustomer = async (customer: Customer) => {
        try {
            await CustomersProvider.deleteCustomer(customer.id);
            await mutate();
            setAlert({
                title: t("customer.table.actions.delete.success"),
                type: "success",
                hideIcon: false,
            });
        } catch (e) {
            console.error(e);
            setAlert({
                title: t("customer.table.actions.delete.error"),
                type: "danger",
                hideIcon: false,
            });
        }
    };

    const loadingState =
        isLoading || customers.data.length === 0 ? "loading" : "idle";

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
                aria-label="suppliers-table-list"
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
                onRowAction={handleRowAction}
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
                    items={customers.data}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    loadingState={loadingState}
                >
                    {customers.data.map((customer) => (
                        <TableRow
                            key={customer.id}
                            className="hover:bg-zinc-500 hover:bg-opacity-10 cursor-pointer"
                        >
                            <TableCell>
                                <h3 className="text-md">
                                    {customer.lastname +
                                        " " +
                                        customer.firstname}
                                </h3>
                                <p className="text-sm text-light-400">
                                    {customer.email} - {customer.phone}
                                </p>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">
                                    {customer.store.name}
                                </h3>
                            </TableCell>
                            <TableCell>
                                <p className="text-md">
                                    {customer.full_address}
                                </p>
                            </TableCell>
                            <TableCell>
                                <p>{customer.orders_count}</p>
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "customer.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                navigate(
                                                    `/customers/${customer.id}/edit`,
                                                    {
                                                        state: {
                                                            customer,
                                                        },
                                                    },
                                                ),
                                        },
                                        {
                                            label: t(
                                                "customer.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: Action.create(async () => {
                                                await handleDeleteCustomer(
                                                    customer,
                                                );
                                            })
                                                .confirm(
                                                    t(
                                                        "customer.table.actions.delete.dialog.title",
                                                    ),
                                                    t(
                                                        "customer.table.actions.delete.dialog.message",
                                                        {
                                                            name:
                                                                customer.firstname +
                                                                " " +
                                                                customer.lastname,
                                                        },
                                                    ),
                                                    "danger",
                                                    t(
                                                        "customer.table.actions.delete.dialog.confirm",
                                                    ),
                                                    t("generics.cancel"),
                                                )
                                                .build(),
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
