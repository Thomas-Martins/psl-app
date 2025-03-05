import {
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
import { ThreeDotMenuProps } from "@/types/ThreeDotMenu.ts";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { useState } from "react";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import { Action } from "@utils/Action.ts";
import { useTranslation } from "react-i18next";

interface UsersTableListProps {
    users: PaginatedUsers;
    fetchUsers: (page: number, limit: number) => void;
}
export default function UsersTableList({
    users,
    fetchUsers,
}: UsersTableListProps) {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(users.current_page);
    const [limit, setLimit] = useState(users.per_page);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchUsers(page, limit);
    };

    const handleLimitChange = (newLimit: number | "all") => {
        const effectiveLimit =
            newLimit === "all" ? Number(users.total) || 10 : newLimit;
        setLimit(effectiveLimit);
        setCurrentPage(1); // Remise à la première page
        fetchUsers(1, effectiveLimit);
    };

    return (
        <div className="">
            <Table
                removeWrapper
                aria-label="users-table-list"
                bottomContent={
                    <PaginateFooter
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        totalPages={users.last_page}
                        totalItems={users.total}
                        itemsPerPage={limit}
                        onLimitChange={handleLimitChange}
                    />
                }
            >
                <TableHeader>
                    {UsersTableListHeaders.map((header) => (
                        <TableColumn key={header.key}>
                            {header.label}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody emptyContent={t("users.table.empty")}>
                    {users.data.map((user: User) => {
                        const actions: ThreeDotMenuProps["actions"] = [
                            {
                                label: t("users.table.actions.view"),
                                variant: "default",
                                onClick: async () => {
                                    const { data } =
                                        await UsersProvider.getUser(user.id);
                                    console.log("Voir", data);
                                },
                            },
                            {
                                label: t("users.table.actions.edit"),
                                variant: "default",
                                onClick: () => console.log("Modifier", user.id),
                            },
                            {
                                label: t("users.table.actions.delete.title"),
                                variant: "danger",
                                onClick: Action.create(async () => {
                                    await UsersProvider.deleteUser(user.id);
                                    fetchUsers(currentPage, limit);
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
                        ];
                        return (
                            <TableRow key={user.id}>
                                <TableCell>
                                    {user.firstname + " " + user.lastname}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <RoleChip role={user.role} />
                                </TableCell>
                                <TableCell>
                                    {user.address +
                                        " " +
                                        user.zipcode +
                                        " " +
                                        user.city}
                                </TableCell>
                                <TableCell>
                                    <ThreeDotMenu actions={actions} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
