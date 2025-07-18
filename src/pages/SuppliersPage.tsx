import { Button, useDisclosure, addToast } from "@heroui/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import { PaginatedSuppliers } from "@/types/Suppliers.ts";
import { useTranslation } from "react-i18next";
import SuppliersTableList from "@components/Intranet/Suppliers/SuppliersTableList.tsx";
import SuppliersAccordionListMobile from "@components/Intranet/Suppliers/SuppliersAccordionListMobile";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import type { FormValues } from "@/types/FormTypes.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";
import { SuppliersAddModalInputs } from "@components/Intranet/Suppliers/SuppliersAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { Outlet, useLocation } from "react-router";
import { useMediaQuery } from "@utils/hook/useMediaQuery";

const fetchSuppliers = async (key: string): Promise<PaginatedSuppliers> => {
    const params = JSON.parse(key);
    const response = await SuppliersProvider.getSuppliers({
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
    });
    return response.data;
};

export default function SuppliersPage() {
    const { t } = useTranslation();
    const { orderBy, orderWay, handleSortChange } = useSort("name", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [search, setSearch] = useState<string | null>(null);

    const location = useLocation();

    const swrKey = JSON.stringify({
        key: "suppliers",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        search,
    });

    const {
        data: suppliers,
        error,
        isLoading,
        mutate,
    } = useSWR<PaginatedSuppliers>(swrKey, fetchSuppliers, {
        keepPreviousData: true,
    });

    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        if (location.pathname === "/suppliers") {
            mutate();
        }
    }, [location.pathname, mutate]);

    const handleSupplierAddSubmit = async (data: FormValues): Promise<void> => {
        const payload = new FormData();

        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value instanceof File) {
                payload.append(key, value);
            } else if (value !== null) {
                payload.append(key, value.toString());
            }
        });

        try {
            await SuppliersProvider.createSupplier(payload);
            await mutate();
            onOpenChange();
            addToast({
                color: "success",
                title: t("suppliers.add.alert.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (e) {
            console.error(e);
            addToast({
                color: "danger",
                title: t("suppliers.add.alert.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await SuppliersAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    if (error) return <div>{t("errors.message")}</div>;

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-5">
                <div className="w-full md:w-1/4">
                    <SearchInput setSearch={setSearch} classNames={"w-full"} />
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
                        {t("suppliers.add.button")}
                    </Button>
                </div>
            </div>
            {isMobile ? (
                <SuppliersAccordionListMobile
                    suppliers={suppliers?.data || []}
                    isLoading={isLoading}
                    mutate={mutate}
                />
            ) : (
                <SuppliersTableList
                    suppliers={
                        suppliers || {
                            current_page: 1,
                            data: [],
                            per_page: 10,
                            total: 0,
                            last_page: 1,
                        }
                    }
                    onSortChange={handleSortChange}
                    orderBy={orderBy}
                    orderWay={orderWay}
                    isLoading={isLoading}
                    mutate={mutate}
                />
            )}
            {suppliers && suppliers.data && suppliers.data.length > 0 && (
                <PaginateFooter
                    values={["10", "50", "100"]}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    totalPages={suppliers?.last_page || 1}
                    totalItems={suppliers?.total || 0}
                    itemsPerPage={limit}
                    onLimitChange={(newLimit) =>
                        handleLimitChange(
                            newLimit,
                            suppliers ? Number(suppliers.total) : 10,
                        )
                    }
                />
            )}
            <AddFormModal
                title={t("suppliers.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleSupplierAddSubmit}
            />

            <Outlet context={{ mutate }} />
        </div>
    );
}
