import { PaginatedCarriers } from "@/types/Carriers.ts";
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { Button, useDisclosure } from "@heroui/react";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FieldDefinition, FormValues } from "@/types/FormTypes.ts";
import useSWR from "swr";
import CarriersTableList from "@components/Intranet/Carriers/CarriersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import { CarriersAddFormInputs } from "@components/Intranet/Carriers/CarriersAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { Outlet, useLocation } from "react-router";

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
    const { setAlert } = useGlobalAlert();
    const { orderWay, orderBy, handleSortChange } = useSort("name", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    const [search, setSearch] = useState<string | null>(null);

    const location = useLocation();

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

    useEffect(() => {
        if (location.pathname === "/carriers") {
            mutate();
        }
    }, [location.pathname, mutate]);

    const handleCarrierAddSubmit = async (data: FormValues): Promise<void> => {
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
            await CarriersProvider.createCarrier(payload);
            await mutate();
            onOpenChange();
            setAlert({
                title: t("carriers.add.alert.success"),
                type: "success",
            });
        } catch (e) {
            console.error(e);
            setAlert({
                title: t("carriers.add.alert.error"),
                type: "danger",
            });
        }
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
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="w-full lg:w-1/4">
                    <SearchInput setSearch={setSearch} classNames={"w-full"} />
                </div>
                <div className="w-full lg:w-auto">
                    <Button
                        aria-label="add"
                        color="primary"
                        size="md"
                        onPress={onOpen}
                        className="w-full lg:w-auto"
                    >
                        <AddSquareIcon size={24} color="white" />
                        {t("suppliers.add.button")}
                    </Button>
                </div>
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

            {carriers && carriers.data && carriers.data.length > 0 && (
                <PaginateFooter
                    values={["10", "50", "100"]}
                    totalPages={carriers?.last_page || 1}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    itemsPerPage={limit}
                    totalItems={carriers?.total || 0}
                    onLimitChange={(newLimit) =>
                        handleLimitChange(
                            newLimit,
                            carriers ? Number(carriers.total) : 10,
                        )
                    }
                />
            )}

            <AddFormModal
                title={t("carriers.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleCarrierAddSubmit}
            />

            <Outlet context={{ mutate }} />
        </div>
    );
}
