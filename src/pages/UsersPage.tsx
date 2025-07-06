import {
    Button,
    Select,
    SelectItem,
    useDisclosure,
    addToast,
} from "@heroui/react";
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
import type { FormValues } from "@/types/FormTypes.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { Outlet } from "react-router";
import UsersAccordionListMobile from "@components/Intranet/Users/UsersAccordionListMobile";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useMediaQuery } from "@utils/hook/useMediaQuery";

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
    const { t, i18n } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { orderBy, orderWay, handleSortChange } = useSort("identity", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

    const [selectedRole, setSelectedRole] = useState("all");
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

    const handleRoleChange = (roleValue: string) => {
        setSelectedRole(roleValue);
        handlePageChange(1);
    };

    const handleUserAddSubmit = async (data: FormValues): Promise<void> => {
        const payload = new FormData();

        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value instanceof File) {
                payload.append(key, value);
            } else if (value !== null) {
                payload.append(key, value.toString());
            }
        });

        payload.append("locale", i18n.language);

        try {
            await UsersProvider.createUser(payload);
            await mutate();
            onOpenChange();
            addToast({
                title: t("users.add.alert.success"),
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("users.add.alert.error"),
                color: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await UserAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    const authenticatedUserId = useSelector(
        (state: RootState) => state.user.id,
    );
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (error) {
        return <div>{t("error.message")}</div>;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-5">
                <div className="flex flex-col md:flex-row w-full gap-4 md:gap-5 lg:w-2/3">
                    <Select
                        aria-label="role-filter"
                        className="w-full md:w-1/4"
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
                    <SearchInput
                        setSearch={setSearch}
                        classNames={"w-full md:w-1/4"}
                    />
                </div>
                <div className="w-full md:w-auto">
                    <Button
                        aria-label="add"
                        color="primary"
                        size="md"
                        onPress={onOpen}
                        className="w-full md:w-auto"
                    >
                        <AddSquareIcon size={24} color="white" />
                        {t("users.add.button")}
                    </Button>
                </div>
            </div>

            {isMobile ? (
                <UsersAccordionListMobile
                    users={users?.data || []}
                    isLoading={isLoading}
                    mutate={mutate}
                    authenticatedUserId={authenticatedUserId}
                />
            ) : (
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
            )}

            {users && users.data && users.data.length > 0 && (
                <PaginateFooter
                    values={["10", "50", "100"]}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    totalPages={users?.last_page || 1}
                    totalItems={users?.total || 0}
                    itemsPerPage={limit}
                    onLimitChange={(newLimit) =>
                        handleLimitChange(
                            newLimit,
                            users ? Number(users.total) : 10,
                        )
                    }
                />
            )}

            <AddFormModal
                title={t("users.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleUserAddSubmit}
            />

            <Outlet context={{ mutate }} />
        </div>
    );
}
