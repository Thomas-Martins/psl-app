import { PaginatedStores } from "@/types/Stores.ts";
import StoresProvider from "@core/api/Providers/StoresProvider.ts";
import { useTranslation } from "react-i18next";
import { Button, useDisclosure } from "@heroui/react";
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
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";

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
    const { setAlert } = useGlobalAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("name");
    const [orderWay, setOrderWay] = useState<"ASC" | "DESC">("ASC");
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleLimitChange = (newLimit: number | "all") => {
        const effectiveLimit =
            newLimit === "all"
                ? stores
                    ? Number(stores.total)
                    : 10
                : newLimit;
        setLimit(effectiveLimit);
        setCurrentPage(1);
    };

    const handleSortChange = (orderBy: string, orderWay: "ASC" | "DESC") => {
        setOrderBy(orderBy);
        setOrderWay(orderWay);
    };

    const handleStoresAddSubmit = async (data: FormValues): Promise<void> => {
        const payload = new FormData();

        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (value instanceof File) {
                payload.append(key, value);
            } else if (value !== null) {
                payload.append(key, value);
            }
        });

        try {
            await StoresProvider.createStore(payload);
            await mutate();
            setAlert({
                title: t("stores.add.alert.success"),
                type: "success",
            });
        } catch (error) {
            console.error(error);
            setAlert({
                title: t("stores.add.alert.error"),
                type: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await StoresAddModalInputs();
            setInputs(fields);
        })();
    }, []);

    if (error) {
        return <div>{t("errors.message")}</div>;
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
                        {t("stores.add.button")}
                    </Button>
                </div>
            </div>

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

            <PaginateFooter
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                totalPages={stores?.last_page || 1}
                totalItems={stores?.total || 0}
                itemsPerPage={limit}
                onLimitChange={handleLimitChange}
            />

            <AddFormModal
                title={t("stores.add.title")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                fields={inputs}
                onSubmit={handleStoresAddSubmit}
            />
        </div>
    );
}
