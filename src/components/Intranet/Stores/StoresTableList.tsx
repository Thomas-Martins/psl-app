import { useTranslation } from "react-i18next";
import { StoresTableListHeaders } from "@components/Intranet/Stores/StoresTableList.headers.ts";
import { useEffect, useState } from "react";
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
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import { Action } from "@utils/Action.ts";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";

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
    const headers = StoresTableListHeaders(t);
    const { setAlert } = useGlobalAlert();

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

    const handleDeleteStore = async (store: Store) => {
        try {
            await StoresProvider.deleteStore(store.id);
            await mutate();
            setAlert({
                title: t("stores.table.actions.delete.success"),
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setAlert({
                title: t("stores.table.actions.delete.error"),
                type: "danger",
            });
        }
    };

    const loadingState =
        isLoading || stores.data.length === 0 ? "loading" : "idle";

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
                    loadingState={loadingState}
                >
                    {stores.data.map((store) => (
                        <TableRow key={store.id}>
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
                                                "stores.table.actions.view",
                                            ),
                                            variant: "default",
                                            onClick: async () => {
                                                const { data } =
                                                    await StoresProvider.getStore(
                                                        store.id,
                                                    );
                                                console.log("Voir", data);
                                            },
                                        },
                                        {
                                            label: t(
                                                "stores.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                console.log(
                                                    "Modifier",
                                                    store.id,
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
