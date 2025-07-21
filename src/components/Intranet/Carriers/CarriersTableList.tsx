import { Carrier, PaginatedCarriers } from "@/types/Carriers.ts";
import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    addToast,
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import { Action } from "@utils/Action.ts";
import { CarriersTableListHeaders } from "@components/Intranet/Carriers/CarriersTableList.headers.ts";
import { useTranslation } from "react-i18next";
import { Key, useState, useEffect } from "react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared/src/collections";
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { useNavigate } from "react-router";

interface CarriersTableListProps {
    carriers: PaginatedCarriers;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    isLoading: boolean;
    mutate: () => Promise<PaginatedCarriers | undefined>;
}
export default function CarriersTableList({
    carriers,
    onSortChange,
    orderBy,
    orderWay,
    isLoading,
    mutate,
}: CarriersTableListProps) {
    const { t } = useTranslation();
    const headers = CarriersTableListHeaders(t);
    const navigate = useNavigate();

    const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
        column: orderBy,
        direction: orderWay === "ASC" ? "ascending" : "descending",
    });

    useEffect(() => {
        setSortDescriptor({
            column: orderBy,
            direction: orderWay === "ASC" ? "ascending" : "descending",
        });
    }, [orderBy, orderWay]);

    const handleRowAction = (key: Key) => {
        navigate(`/carriers/${key}`);
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

    const handleDeleteSupplier = async (carrier: Carrier) => {
        try {
            await CarriersProvider.deleteCarrier(carrier.id);
            await mutate();
            addToast({
                title: t("carriers.table.actions.delete.success"),
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("carriers.table.actions.delete.error"),
                color: "danger",
            });
        }
    };

    if (!isLoading && carriers.data.length === 0) {
        return (
            <div className="py-8 text-center text-gray-400">
                Aucun transporteur trouvé.
            </div>
        );
    }
    const loadingState = isLoading ? "loading" : "idle";

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
                    items={carriers.data}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    loadingState={loadingState}
                >
                    {carriers.data.map((carrier) => (
                        <TableRow
                            key={carrier.id}
                            className="hover:bg-zinc-500 hover:bg-opacity-10 cursor-pointer"
                        >
                            <TableCell>
                                <h3 className="text-md">{carrier.name}</h3>
                                <p className="text-sm text-light-400">
                                    {carrier.email}
                                </p>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">
                                    {carrier.contact_person_lastname +
                                        " " +
                                        carrier.contact_person_firstname}
                                </h3>
                                <p className="text-sm text-light-400">
                                    {carrier.contact_person_email}
                                </p>
                            </TableCell>
                            <TableCell>
                                {carrier.address +
                                    ", " +
                                    carrier.zipcode +
                                    " " +
                                    carrier.city}
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "carriers.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                navigate(
                                                    `/carriers/${carrier.id}/edit`,
                                                ),
                                        },
                                        {
                                            label: t(
                                                "carriers.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: Action.create(async () => {
                                                await handleDeleteSupplier(
                                                    carrier,
                                                );
                                            })
                                                .confirm(
                                                    t(
                                                        "carriers.table.actions.delete.dialog.title",
                                                    ),
                                                    t(
                                                        "carriers.table.actions.delete.dialog.message",
                                                        {
                                                            name: carrier.name,
                                                        },
                                                    ),
                                                    "danger",
                                                    t(
                                                        "carriers.table.actions.delete.dialog.confirm",
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
