import { PaginatedCarriers } from "@/types/Carriers.ts";
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { Button, useDisclosure } from "@heroui/react";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FieldDefinition } from "@/types/FormTypes.ts";
import useSWR from "swr";
import CarriersTableList from "@components/Intranet/Carriers/CarriersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import { CarriersAddFormInputs } from "@components/Intranet/Carriers/CarriersAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";

const fetchCarriers = async (key: string): Promise<PaginatedCarriers> => {
    const params = JSON.parse(key);
    const response = await CarriersProvider.getCarriers({
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
    });
    return response.data;
};

export default function CarriersPage() {
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("name");
    const [orderWay, setOrderWay] = useState<"ASC" | "DESC">("ASC");
    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    const [search, setSearch] = useState<string | null>(null);

    const swrKey = JSON.stringify({
        key: "carriers",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        search,
    });

    const {
        data: carriers,
        error,
        isLoading,
        mutate,
    } = useSWR<PaginatedCarriers>(swrKey, fetchCarriers, {
        keepPreviousData: true,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (newLimit: number | "all") => {
        const effectiveLimit =
            newLimit === "all"
                ? carriers
                    ? Number(carriers.total)
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
    const handleCarrierAddSubmit = async (data: Record<string, string>) => {
        await CarriersProvider.createCarrier(data);

        mutate();
        onOpenChange();
    };

    useEffect(() => {
        (async () => {
            const fields = await CarriersAddFormInputs();
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

            <CarriersTableList
                carriers={
                    carriers || {
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
                totalPages={carriers?.last_page || 1}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                itemsPerPage={limit}
                totalItems={carriers?.total || 0}
                onLimitChange={handleLimitChange}
            />

            <AddFormModal
                title={t("carriers.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleCarrierAddSubmit}
            />
        </div>
    );
}
