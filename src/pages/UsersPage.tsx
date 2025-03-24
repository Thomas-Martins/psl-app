import { Button, Select, SelectItem, useDisclosure } from "@heroui/react";
import useSWR from "swr";
import { useEffect, useState } from "react";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import { PaginatedUsers } from "@/types/Users.ts";
import { useTranslation } from "react-i18next";
import UsersTableList from "@components/Intranet/Users/UsersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import { UserAddModalInputs } from "@components/Intranet/Users/UserAddForm.inputs.ts";
import type { FormData } from "@/types/FormTypes.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";

const fetchUsers = async (key: string): Promise<PaginatedUsers> => {
    const params = JSON.parse(key);

    const response = await UsersProvider.getUsers({
        onlyUsers: true,
        paginate: true,
        page: params.page,
        limit: params.limit,
        role: params.selectedRole,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
    });
    return response.data;
};

export default function UsersPage() {
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { setAlert } = useGlobalAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedRole, setSelectedRole] = useState("all");
    const [orderBy, setOrderBy] = useState("identity");
    const [orderWay, setOrderWay] = useState<"ASC" | "DESC">("ASC");
    const [search, setSearch] = useState<string | null>(null);

    const [inputs, setInputs] = useState<FieldDefinition[]>([]);

    const swrKey = JSON.stringify({
        key: "users",
        page: currentPage,
        limit,
        selectedRole,
        orderBy,
        orderWay,
        search,
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

    const handleUserAddSubmit = async (data: FormData) => {
        const payload = new FormData();

        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value instanceof File) {
                payload.append(key, value);
            } else if (value !== null) {
                payload.append(key, value);
            }
        });

        try {
            await UsersProvider.createUser(payload);
            await mutate();
            onOpenChange();
            setAlert({
                title: t("users.add.alert.success"),
                type: "success",
            });
        } catch (e) {
            console.error(e);
            setAlert({
                title: t("users.add.alert.error"),
                type: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await UserAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    if (error) {
        return <div>{t("error.message")}</div>;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5 w-full">
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
                    <SearchInput setSearch={setSearch} />
                </div>
                <div>
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
