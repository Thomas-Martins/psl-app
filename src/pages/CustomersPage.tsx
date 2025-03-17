import { PaginatedCustomers } from "@/types/Customers.ts";
import CustomersProvider from "@core/api/Providers/CustomersProvider.ts";
import { useTranslation } from "react-i18next";
import { Button, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { FieldDefinition } from "@/types/FormTypes.ts";
import useSWR from "swr";
import SearchInput from "@components/tools/SearchInput.tsx";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import CustomersTableList from "@components/Intranet/Clients/CustomersTableList.tsx";
import { CustomersAddModalInputs } from "@components/Intranet/Clients/CustomersAddForm.inputs.ts";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";

const fetchCustomers = async (key: string): Promise<PaginatedCustomers> => {
    const params = JSON.parse(key);

    const response = await CustomersProvider.getCustomers({
        onlyCustomers: true,
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
    });

    return response.data;
};

export default function CustomersPage() {
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("identity");
    const [orderWay, setOrderWay] = useState<"ASC" | "DESC">("ASC");
    const [search, setSearch] = useState<string | null>(null);

    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    const swrKey = JSON.stringify({
        key: "customers",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        search,
    });

    const {
        data: customers,
        error,
        isLoading,
        mutate,
    } = useSWR<PaginatedCustomers>(swrKey, fetchCustomers, {
        keepPreviousData: true,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (newLimit: number | "all") => {
        const effectiveLimit =
            newLimit === "all"
                ? customers
                    ? Number(customers.total)
                    : 10
                : newLimit;
        setLimit(effectiveLimit);
        setCurrentPage(1);
    };

    const handleSortChange = (
        newOrderBy: string,
        newOrderWay: "ASC" | "DESC",
    ) => {
        setOrderBy(newOrderBy);
        setOrderWay(newOrderWay);
    };

    const handleCustomerAddSubmit = async (
        formData: Record<string, string>,
    ) => {
        formData.role_id = "4";
        await UsersProvider.createUser(formData);
        await mutate();
        onOpenChange();
    };

    useEffect(() => {
        (async () => {
            const fields = await CustomersAddModalInputs();
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

            <CustomersTableList
                customers={
                    customers || {
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
                totalPages={customers?.last_page || 1}
                totalItems={customers?.total || 0}
                itemsPerPage={limit}
                onLimitChange={handleLimitChange}
            />

            <AddFormModal
                title={t("customer.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleCustomerAddSubmit}
            />
        </div>
    );
}
