import { useTranslation } from "react-i18next";
import { Button, useDisclosure } from "@heroui/react";
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
import ProductsAccordionListMobile from "@components/Intranet/Products/ProductsAccordionListMobile.tsx";
import { Outlet } from "react-router";
import { ProductsContext } from "@/contexts/Products/ProductsContext";
import { useMediaQuery } from "@utils/hook/useMediaQuery";
import { addToast } from "@heroui/react";
import ProductAddStockModal from "@components/Intranet/Products/ProductAddStockModal";
import PageTitle from "@components/tools/PageTitle";

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
            addToast({
                color: "success",
                title: t("products.add.alert.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (e) {
            console.error(e);
            addToast({
                color: "danger",
                title: t("products.add.alert.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    useEffect(() => {
        (async () => {
            const fields = await ProductsAddFormInputs();
            setInputs(fields);
        })();
    }, []);

    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isAddStockOpen, setIsAddStockOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        null,
    );

    const handleOpenAddStockModal = (productId: string) => {
        setSelectedProductId(productId);
        setIsAddStockOpen(true);
    };

    if (error) return <div>{t("errors.message")}</div>;

    return (
        <ProductsContext.Provider value={{ mutate }}>
            <PageTitle i18nKey="products._name" />
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
                            {t("products.add.button")}
                        </Button>
                    </div>
                </div>

                {isMobile ? (
                    <ProductsAccordionListMobile
                        products={products?.data || []}
                        isLoading={isLoading}
                        mutate={mutate}
                        onOpenAddStockModal={handleOpenAddStockModal}
                    />
                ) : (
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
                )}

                {products && products.data && products.data.length > 0 && (
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
                )}

                <AddFormModal
                    title={t("products.add.title")}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    fields={inputs}
                    onSubmit={handleProductsAddSubmit}
                />

                <ProductAddStockModal
                    isOpen={isAddStockOpen}
                    onOpenChange={() => setIsAddStockOpen(false)}
                    productId={selectedProductId}
                    onSuccess={async () => {
                        await mutate();
                        setIsAddStockOpen(false);
                        setSelectedProductId(null);
                    }}
                />

                <Outlet />
            </div>
        </ProductsContext.Provider>
    );
}
