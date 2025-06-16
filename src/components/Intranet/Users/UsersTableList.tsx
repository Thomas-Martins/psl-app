import { Key, useEffect, useState } from "react";
import {
    Avatar,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import { UsersTableListHeaders } from "@components/Intranet/Users/UsersTableList.headers.ts";
import RoleChip from "@components/ui/global/RoleChip.tsx";
import { PaginatedUsers, User } from "@/types/Users.ts";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { Action } from "@utils/Action.ts";
import { useTranslation } from "react-i18next";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { InitialsLetter } from "@utils/utils.ts";
import { useNavigate } from "react-router";

interface UsersTableListProps {
    users: PaginatedUsers;
    isLoading: boolean;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    mutate: () => Promise<PaginatedUsers | undefined>;
}

export default function UsersTableList({
    users,
    isLoading,
    onSortChange,
    orderBy,
    orderWay,
    mutate,
}: UsersTableListProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const headers = UsersTableListHeaders(t);
    const { setAlert } = useGlobalAlert();

    const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
        column: orderBy,
        direction: orderWay === "ASC" ? "ascending" : "descending",
    });

    const handleRowAction = (key: Key) => {
        navigate(`/users/${key}`);
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

    const handleDeleteUser = async (user: User) => {
        try {
            await UsersProvider.deleteUser(user.id);
            await mutate();
            setAlert({
                title: t("users.table.actions.delete.success"),
                type: "success",
            });
        } catch (e) {
            console.error(e);
            setAlert({
                title: t("users.table.actions.delete.error"),
                type: "danger",
            });
        }
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
                    items={users.data ?? []}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    emptyContent={t("users.table.empty")}
                    loadingState={loadingState}
                >
                    {(user: User) => (
                        <TableRow
                            key={user.id}
                            className="hover:bg-zinc-500 hover:bg-opacity-10 cursor-pointer"
                        >
                            <TableCell className="flex flex-row items-center gap-2">
                                <Avatar
                                    src={user.image_url}
                                    name={InitialsLetter(
                                        user.firstname,
                                        user.lastname,
                                    )}
                                />
                                <div>
                                    <h3 className="text-md">{user.identity}</h3>
                                    <p className="text-sm text-light-400">
                                        {user.email} - {user.phone}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <RoleChip role={user.role} />
                            </TableCell>
                            <TableCell>
                                {user.address} {user.zipcode} {user.city}
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "users.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                navigate(
                                                    `/users/${user.id}/edit`,
                                                    {
                                                        state: { user: user },
                                                    },
                                                ),
                                        },
                                        {
                                            label: t(
                                                "users.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: Action.create(async () => {
                                                await handleDeleteUser(user);
                                            })
                                                .confirm(
                                                    t(
                                                        "users.table.actions.delete.dialog.title",
                                                    ),
                                                    t(
                                                        "users.table.actions.delete.dialog.message",
                                                        {
                                                            name:
                                                                user.firstname +
                                                                " " +
                                                                user.lastname,
                                                        },
                                                    ),
                                                    "danger",
                                                    t(
                                                        "users.table.actions.delete.dialog.confirm",
                                                    ),
                                                    t("generics.cancel"),
                                                )
                                                .build(),
                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
