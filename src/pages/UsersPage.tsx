import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import useSWR from "swr";
import { useEffect, useState } from "react";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import { PaginatedUsers } from "@/types/Users.ts";
import { useTranslation } from "react-i18next";
import UsersTableList from "@components/Intranet/Users/UsersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/global/AddFormModal.tsx";
import { UserAddModalInputs } from "@components/Intranet/Users/UserAddForm.inputs.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";

const fetchUsers = async (key: string): Promise<PaginatedUsers> => {
    const { page, limit, selectedRole, orderBy, orderWay } = JSON.parse(key);

    const params = {
        onlyUsers: true,
        paginate: true,
        page,
        limit,
        role: selectedRole,
        orderBy,
        orderWay,
    };

    const response = await UsersProvider.getUsers(params);
    return response.data;
};

export default function UsersPage() {
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedRole, setSelectedRole] = useState("all");
    const [orderBy, setOrderBy] = useState("identity");
    const [orderWay, setOrderWay] = useState<"ASC" | "DESC">("ASC");

    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    useEffect(() => {
        (async () => {
            const fields = await UserAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    const swrKey = JSON.stringify({
        page: currentPage,
        limit,
        selectedRole,
        orderBy,
        orderWay,
    });

    const {
        data: users,
        error,
        isLoading,
        mutate,
    } = useSWR<PaginatedUsers>(swrKey, fetchUsers, {
        keepPreviousData: true,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (newLimit: number | "all") => {
        const effectiveLimit =
            newLimit === "all" ? (users ? Number(users.total) : 10) : newLimit;
        setLimit(effectiveLimit);
        setCurrentPage(1);
    };

    const handleRoleChange = (roleValue: string) => {
        setSelectedRole(roleValue);
        setCurrentPage(1);
    };

    const handleSortChange = (
        newOrderBy: string,
        newOrderWay: "ASC" | "DESC",
    ) => {
        setOrderBy(newOrderBy);
        setOrderWay(newOrderWay);
    };

    const handleUserAddSubmit = async (formData: Record<string, string>) => {
        await UsersProvider.createUser(formData);
        await mutate(); // revalidate SWR after creation
        onOpenChange();
    };

    if (error) {
        return <div>{t("error.message")}</div>;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Select
                    aria-label="role-filter"
                    className="w-1/4"
                    size="md"
                    defaultSelectedKeys={["all"]}
                    onChange={(e) => handleRoleChange(e.target.value)}
                >
                    <SelectItem key="all">
                        {t("users.table.filter.role.all")}
                    </SelectItem>
                    <SelectItem key="admin">
                        {t("users.table.filter.role.admin")}
                    </SelectItem>
                    <SelectItem key="gestionnaire">
                        {t("users.table.filter.role.gestionnaire")}
                    </SelectItem>
                    <SelectItem key="logisticien">
                        {t("users.table.filter.role.logisticien")}
                    </SelectItem>
                </Select>
                <Button
                    aria-label="add"
                    color="primary"
                    size="md"
                    onPress={onOpen}
                >
                    <AddSquareIcon size={24} color="white" />
                    {t("users.add.button")}
                </Button>
            </div>

            <UsersTableList
                users={
                    users || {
                        current_page: 1,
                        data: [],
                        per_page: 10,
                        total: 0,
                        last_page: 1,
                    }
                }
                isLoading={isLoading}
                onSortChange={handleSortChange}
                orderBy={orderBy}
                orderWay={orderWay}
                mutate={mutate}
            />

            <PaginateFooter
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                totalPages={users?.last_page || 1}
                totalItems={users?.total || 0}
                itemsPerPage={limit}
                onLimitChange={handleLimitChange}
            />

            <AddFormModal
                title={t("users.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleUserAddSubmit}
            />
        </div>
    );
}
