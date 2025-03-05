import {
    Button,
    CircularProgress,
    Select,
    SelectItem,
    useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import UsersTableList from "@components/Intranet/Users/UsersTableList.tsx";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import UserAddModal from "@components/Intranet/Users/UserAddModal.tsx";
import { PaginatedUsers } from "@/types/Users.ts";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState<PaginatedUsers>({
        current_page: 1,
        data: [],
        per_page: 10,
        total: 0,
        last_page: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    useEffect(() => {
        (async () => {
            await fetchUsers();
        })();
    }, []);
    const fetchUsers = async (page: number = 1, limit: number = 10) => {
        setIsLoading(true);
        try {
            await UsersProvider.getUsers({
                onlyUsers: true,
                paginate: true,
                page,
                limit,
            }).then((response) => {
                setUsers(response.data);
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const roleFilter = [
        { label: t("users.table.filter.role.all"), value: "all" },
        { label: t("users.table.filter.role.admin"), value: "admin" },
        {
            label: t("users.table.filter.role.gestionnaire"),
            value: "gestionnaire",
        },
        {
            label: t("users.table.filter.role.logisticien"),
            value: "logisticien",
        },
    ];
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <Select
                    aria-label="role-filter"
                    className="w-1/4"
                    size="md"
                    selectionMode="multiple"
                    defaultSelectedKeys={["all"]}
                >
                    {roleFilter.map((role) => (
                        <SelectItem key={role.value}>{role.label}</SelectItem>
                    ))}
                </Select>
                <Button
                    aria-label="add"
                    color="primary"
                    size="md"
                    onPress={onOpen}
                >
                    <AddSquareIcon size={24} color="white" />
                    Ajouter
                </Button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-80">
                    <CircularProgress
                        aria-label="loader"
                        className="stroke-primary-500"
                    />
                </div>
            ) : (
                <UsersTableList users={users} fetchUsers={fetchUsers} />
            )}

            {/* Add Users Modal */}
            <UserAddModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fetchUsers={fetchUsers}
            />
        </div>
    );
}
