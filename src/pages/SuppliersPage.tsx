import { Button, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import { PaginatedSuppliers } from "@/types/Suppliers.ts";
import { useTranslation } from "react-i18next";
import SuppliersTableList from "@components/Intranet/Suppliers/SuppliersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/global/AddFormModal.tsx";
import { FieldDefinition } from "@/types/FormTypes.ts";
import { SuppliersAddModalInputs } from "@components/Intranet/Suppliers/SuppliersAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("name");
    const [orderWay, setOrderWay] = useState<"ASC" | "DESC">("ASC");
    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [search, setSearch] = useState<string | null>(null);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (newLimit: number | "all") => {
        const effectiveLimit =
            newLimit === "all"
                ? suppliers
                    ? Number(suppliers.total)
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

    const handleSupplierAddSubmit = async (data: Record<string, string>) => {
        await SuppliersProvider.createSupplier(data);
        // Rafraîchir les données après l'ajout
        mutate();
        onOpenChange();
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
                <SearchInput setSearch={setSearch} />
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
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                totalPages={suppliers?.last_page || 1}
                totalItems={suppliers?.total || 0}
                itemsPerPage={limit}
                onLimitChange={handleLimitChange}
            />
            <AddFormModal
                title={t("suppliers.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleSupplierAddSubmit}
            />
        </div>
    );
}
