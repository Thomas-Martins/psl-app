import { useTranslation } from "react-i18next";
import { Button, useDisclosure } from "@heroui/react";
import { useGlobalAlert } from "@/contexts/GlobalAlertContext.tsx";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import { PaginatedProducts } from "@/types/Products.ts";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { useEffect, useState } from "react";
import { FieldDefinition, FormValues } from "@/types/FormTypes.ts";
import useSWR from "swr";
import { ProductsAddFormInputs } from "@components/Intranet/Products/ProductsAddForm.inputs.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import AddSquareIcon from "@components/ui/icons/AddSquareIcon.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import AddFormModal from "@components/ui/Form/AddFormModal.tsx";
import ProductsTableList from "@components/Intranet/Products/ProductsTableList.tsx";
import { Outlet } from "react-router";
import { ProductsContext } from "@/contexts/Products/ProductsContext";

const fetchProducts = async (key: string): Promise<PaginatedProducts> => {
    const params = JSON.parse(key);
    const response = await ProductsProvider.getProducts({
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
    });
    return response.data;
};
export default function ProductsPage() {
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { setAlert } = useGlobalAlert();
    const { orderWay, orderBy, handleSortChange } = useSort("name", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

    const [inputs, setInputs] = useState<FieldDefinition[]>([]);
    const [search, setSearch] = useState<string | null>(null);

    const swrKey = JSON.stringify({
        key: "products",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        search,
    });

    const {
        data: products,
        error,
        isLoading,
        mutate,
    } = useSWR<PaginatedProducts>(swrKey, fetchProducts, {
        keepPreviousData: true,
    });

    const handleProductsAddSubmit = async (data: FormValues): Promise<void> => {
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
            await ProductsProvider.createProduct(payload);
            await mutate();
            onOpenChange();
            setAlert({
                title: t("products.add.alert.success"),
                type: "success",
            });
        } catch (e) {
            console.error(e);
            setAlert({
                title: t("products.add.alert.error"),
                type: "danger",
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await ProductsAddFormInputs();
            setInputs(fields);
        })();
    }, []);

    if (error) return <div>{t("error.message")}</div>;

    return (
        <ProductsContext.Provider value={{ mutate }}>
            <div className="space-y-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="w-full lg:w-1/4">
                        <SearchInput
                            setSearch={setSearch}
                            classNames={"w-full"}
                        />
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

                <ProductsTableList
                    products={
                        products || {
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
                    totalPages={products?.last_page || 1}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    itemsPerPage={limit}
                    totalItems={products?.total || 0}
                    onLimitChange={(newLimit) =>
                        handleLimitChange(
                            newLimit,
                            products ? Number(products.total) : 10,
                        )
                    }
                />

                <AddFormModal
                    title={t("products.add.title")}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    fields={inputs}
                    onSubmit={handleProductsAddSubmit}
                />

                <Outlet />
            </div>
        </ProductsContext.Provider>
    );
}
