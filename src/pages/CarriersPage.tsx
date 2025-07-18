import { PaginatedCarriers } from "@/types/Carriers.ts";
import CarriersProvider from "@core/api/Providers/CarriersProvider.ts";
import { Button, useDisclosure, addToast } from "@heroui/react";
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
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { Outlet, useLocation } from "react-router";
import CarriersAccordionListMobile from "@components/Intranet/Carriers/CarriersAccordionListMobile";
import { useMediaQuery } from "@utils/hook/useMediaQuery";

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

    const isMobile = useMediaQuery("(max-width: 768px)");

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
            addToast({
                color: "success",
                title: t("carriers.add.alert.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (e) {
            console.error(e);
            addToast({
                color: "danger",
                title: t("carriers.add.alert.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await CarriersAddFormInputs();
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
                        {t("carriers.add.button")}
                    </Button>
                </div>
            </div>

            {isMobile ? (
                <CarriersAccordionListMobile
                    carriers={carriers?.data || []}
                    isLoading={isLoading}
                    mutate={mutate}
                />
            ) : (
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
            )}

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
