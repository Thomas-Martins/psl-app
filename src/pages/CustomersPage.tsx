import { PaginatedCustomers } from "@/types/Customers.ts";
import CustomersProvider from "@core/api/Providers/CustomersProvider.ts";
import { useTranslation } from "react-i18next";
import { Button, useDisclosure, addToast } from "@heroui/react";
import { useEffect, useState } from "react";
import { FieldDefinition, FormValues } from "@/types/FormTypes.ts";
import useSWR from "swr";
import SearchInput from "@components/tools/SearchInput.tsx";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import CustomersTableList from "@components/Intranet/Clients/CustomersTableList.tsx";
import { CustomersAddModalInputs } from "@components/Intranet/Clients/CustomersAddForm.inputs.ts";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import i18n from "@/core/i18n/i18n";
import { Outlet } from "react-router";
import { CustomersContext } from "@/contexts/Customers/CustomersContext";
import { useMediaQuery } from "@utils/hook/useMediaQuery";
import CustomersAccordionListMobile from "@components/Intranet/Clients/CustomersAccordionListMobile";

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
    const { orderBy, orderWay, handleSortChange } = useSort("identity", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

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

    const handleCustomerAddSubmit = async (
        formData: FormValues,
    ): Promise<void> => {
        try {
            formData.role_id = "4";
            formData.locale = i18n.language;
            await UsersProvider.createUser(formData);
            await mutate();
            onOpenChange();
            addToast({
                title: t("customer.add.alert.success"),
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("customer.add.alert.error"),
                color: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await CustomersAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    const isMobile = useMediaQuery("(max-width: 768px)");

    if (error) {
        return <div>{t("error.message")}</div>;
    }

    return (
        <CustomersContext.Provider value={{ mutate }}>
            <div className="space-y-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-5">
                    <div className="w-full md:w-1/4">
                        <SearchInput
                            setSearch={setSearch}
                            classNames={"w-full"}
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
                    <CustomersAccordionListMobile
                        customers={customers?.data || []}
                        isLoading={isLoading}
                        mutate={mutate}
                    />
                ) : (
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
                )}

                {customers && customers.data && customers.data.length > 0 && (
                    <PaginateFooter
                        values={["10", "50", "100"]}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        totalPages={customers?.last_page || 1}
                        totalItems={customers?.total || 0}
                        itemsPerPage={limit}
                        onLimitChange={(newLimit) =>
                            handleLimitChange(
                                newLimit,
                                customers ? Number(customers.total) : 10,
                            )
                        }
                    />
                )}

                <AddFormModal
                    title={t("customer.add.title")}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    fields={inputs}
                    onSubmit={handleCustomerAddSubmit}
                />

                <Outlet />
            </div>
        </CustomersContext.Provider>
    );
}
