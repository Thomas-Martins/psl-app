import { Button, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import { PaginatedSuppliers } from "@/types/Suppliers.ts";
import { useTranslation } from "react-i18next";
import SuppliersTableList from "@components/Intranet/Suppliers/SuppliersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import type { FormValues } from "@/types/FormTypes.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";
import { SuppliersAddModalInputs } from "@components/Intranet/Suppliers/SuppliersAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { Outlet, useLocation } from "react-router";

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
    const { setAlert } = useGlobalAlert();
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
            setAlert({
                title: t("suppliers.add.alert.success"),
                type: "success",
            });
        } catch (e) {
            console.error(e);
            setAlert({
                title: t("suppliers.add.alert.error"),
                type: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await SuppliersAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    if (error) return <div>{t("error.message")}</div>;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <SearchInput setSearch={setSearch} classNames={"w-1/4"} />
                <Button
                    aria-label="add"
                    color="primary"
                    size="md"
                    onPress={onOpen}
                >
                    <AddSquareIcon size={24} color="white" />
                    {t("suppliers.add.button")}
                </Button>
            </div>
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
