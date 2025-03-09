import { useState } from "react";
import { PaginatedSuppliers, Supplier } from "@/types/Suppliers.ts";
import { SuppliersTableListHeaders } from "@components/Intranet/Suppliers/SuppliersTableList.headers.ts";
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import { Action } from "@utils/Action.ts";
import { useTranslation } from "react-i18next";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";

interface SuppliersTableListProps {
    suppliers: PaginatedSuppliers;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    isLoading: boolean;
    mutate: () => Promise<PaginatedSuppliers | undefined>;
}

export default function SuppliersTableList({
    suppliers,
    onSortChange,
    orderBy,
    orderWay,
    isLoading,
    mutate,
}: SuppliersTableListProps) {
    const { t } = useTranslation();
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

    const handleDeleteSupplier = async (supplier: Supplier) => {
        try {
            await SuppliersProvider.deleteSupplier(supplier.id);
            await mutate();
        } catch (e) {
            console.error(e);
        }
    };

    const loadingState =
        isLoading || suppliers.data.length === 0 ? "loading" : "idle";

    return (
        <div>
            <Table
                removeWrapper
                aria-label="suppliers-table-list"
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
            >
                <TableHeader>
                    {SuppliersTableListHeaders.map((header) => (
                        <TableColumn
                            key={header.key}
                            allowsSorting={header.sortable}
                        >
                            {header.label}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody
                    items={suppliers.data}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    loadingState={loadingState}
                >
                    {suppliers.data.map((supplier) => (
                        <TableRow key={supplier.id}>
                            <TableCell>
                                <h3 className="text-md">{supplier.name}</h3>
                                <p className="text-sm text-light-400">
                                    {supplier.email}
                                </p>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">
                                    {supplier.contact_person_lastname +
                                        " " +
                                        supplier.contact_person_firstname}
                                </h3>
                                <p className="text-sm text-light-400">
                                    {supplier.contact_person_email}
                                </p>
                            </TableCell>
                            <TableCell>
                                {supplier.address +
                                    ", " +
                                    supplier.zipcode +
                                    " " +
                                    supplier.city +
                                    ", " +
                                    supplier.country}
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "suppliers.table.actions.view",
                                            ),
                                            variant: "default",
                                            onClick: async () => {
                                                const { data } =
                                                    await SuppliersProvider.getSupplier(
                                                        supplier.id,
                                                    );
                                                console.log("Voir", data);
                                            },
                                        },
                                        {
                                            label: t(
                                                "suppliers.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                console.log(
                                                    "Modifier",
                                                    supplier.id,
                                                ),
                                        },
                                        {
                                            label: t(
                                                "suppliers.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: Action.create(async () => {
                                                await handleDeleteSupplier(
                                                    supplier,
                                                );
                                            })
                                                .confirm(
                                                    t(
                                                        "suppliers.table.actions.delete.dialog.title",
                                                    ),
                                                    t(
                                                        "suppliers.table.actions.delete.dialog.message",
                                                        {
                                                            name: supplier.name,
                                                        },
                                                    ),
                                                    "danger",
                                                    t(
                                                        "suppliers.table.actions.delete.dialog.confirm",
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
