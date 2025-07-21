import { PaginatedStores } from "@/types/Stores.ts";
import StoresProvider from "@core/api/Providers/StoresProvider.ts";
import { useTranslation } from "react-i18next";
import { Button, useDisclosure, addToast } from "@heroui/react";
import { useEffect, useState } from "react";
import type { FormValues } from "@/types/FormTypes.ts";
import { FieldDefinition } from "@/types/FormTypes.ts";
import useSWR from "swr";
import { StoresAddModalInputs } from "@components/Intranet/Stores/StoresAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import StoresTableList from "@components/Intranet/Stores/StoresTableList.tsx";
import StoresAccordionListMobile from "@components/Intranet/Stores/StoresAccordionListMobile";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { Outlet } from "react-router";
import { useMediaQuery } from "@utils/hook/useMediaQuery";
import PageTitle from "@components/tools/PageTitle";

const fetchStores = async (key: string): Promise<PaginatedStores> => {
    const params = JSON.parse(key);

    const response = await StoresProvider.getStores({
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
    });

    return response.data;
};

export default function StoresPage() {
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { orderBy, orderWay, handleSortChange } = useSort("name", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

    const [search, setSearch] = useState<string | null>(null);
    const [inputs, setInputs] = useState<FieldDefinition[]>([]);

    const swrKey = JSON.stringify({
        key: "stores",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        search,
    });

    const {
        data: stores,
        error,
        isLoading,
        mutate,
    } = useSWR<PaginatedStores>(swrKey, fetchStores, {
        keepPreviousData: true,
    });

    const handleStoresAddSubmit = async (data: FormValues): Promise<void> => {
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
            await StoresProvider.createStore(payload);
            await mutate();
            addToast({
                title: t("stores.add.alert.success"),
                color: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({
                title: t("stores.add.alert.error"),
                color: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await StoresAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    const isMobile = useMediaQuery("(max-width: 768px)");

    if (error) {
        return <div>{t("errors.message")}</div>;
    }

    return (
        <>
            <PageTitle i18nKey="stores._name" />
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
                            {t("stores.add.button")}
                        </Button>
                    </div>
                </div>

                {isMobile ? (
                    <StoresAccordionListMobile
                        stores={stores?.data || []}
                        isLoading={isLoading}
                        mutate={mutate}
                    />
                ) : (
                    <StoresTableList
                        stores={
                            stores || {
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

                {stores && stores.data && stores.data.length > 0 && (
                    <PaginateFooter
                        values={["10", "50", "100"]}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        totalPages={stores?.last_page || 1}
                        totalItems={stores?.total || 0}
                        itemsPerPage={limit}
                        onLimitChange={(newLimit) =>
                            handleLimitChange(
                                newLimit,
                                stores ? Number(stores.total) : 10,
                            )
                        }
                    />
                )}

                <AddFormModal
                    title={t("stores.add.title")}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    fields={inputs}
                    onSubmit={handleStoresAddSubmit}
                />

                <Outlet context={{ mutate }} />
            </div>
        </>
    );
}
