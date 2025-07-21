import { useTranslation } from "react-i18next";
import { StoresTableListHeaders } from "@components/Intranet/Stores/StoresTableList.headers.ts";
import { Key, useState } from "react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared/src/collections";
import { PaginatedStores, Store } from "@/types/Stores.ts";
import StoresProvider from "@core/api/Providers/StoresProvider.ts";
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
import { useNavigate } from "react-router";

interface StoresTableListProps {
    stores: PaginatedStores;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    isLoading: boolean;
    mutate: () => Promise<PaginatedStores | undefined>;
}

export default function StoresTableList({
    stores,
    onSortChange,
    orderBy,
    orderWay,
    isLoading,
    mutate,
}: StoresTableListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const headers = StoresTableListHeaders(t);

    const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
        column: orderBy,
        direction: orderWay === "ASC" ? "ascending" : "descending",
    });

    const handleRowAction = (key: Key) => {
        navigate(`/stores/${key}`);
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

    const handleDeleteStore = async (store: Store) => {
        try {
            await StoresProvider.deleteStore(store.id);
            await mutate();
            addToast({
                title: t("stores.table.actions.delete.success"),
                color: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({
                title: t("stores.table.actions.delete.error"),
                color: "danger",
            });
        }
    };

    const loadingState = isLoading ? "loading" : "idle";

    return (
        <div>
            <Table
                removeWrapper
                aria-label="stores-table-list"
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
                    items={stores.data}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    emptyContent={t("stores.table.empty")}
                    loadingState={loadingState}
                >
                    {stores.data.map((store) => (
                        <TableRow
                            key={store.id}
                            className="hover:bg-zinc-500 hover:bg-opacity-10 cursor-pointer"
                        >
                            <TableCell>
                                <h3 className="text-md">{store.name}</h3>
                                <p className="text-sm text-light-400">
                                    {store.email} - {store.phone}
                                </p>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">{store.address}</h3>
                                <p className="text-sm text-light-400">
                                    {store.zipcode}, {store.city}
                                </p>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">
                                    {store.customers_count}
                                </h3>
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "stores.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                navigate(
                                                    `/stores/${store.id}/edit`,
                                                    {
                                                        state: { store: store },
                                                    },
                                                ),
                                        },
                                        {
                                            label: t(
                                                "stores.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: Action.create(async () => {
                                                await handleDeleteStore(store);
                                            })
                                                .confirm(
                                                    t(
                                                        "stores.table.actions.delete.dialog.title",
                                                    ),
                                                    t(
                                                        "stores.table.actions.delete.dialog.message",
                                                        {
                                                            name: store.name,
                                                        },
                                                    ),
                                                    "danger",
                                                    t(
                                                        "stores.table.actions.delete.dialog.confirm",
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
