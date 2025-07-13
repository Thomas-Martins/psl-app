import { useTranslation } from "react-i18next";
import { Button, useDisclosure, Image } from "@heroui/react";
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
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { useMediaQuery } from "@utils/hook/useMediaQuery";
import { useNavigate } from "react-router";
import { addToast } from "@heroui/react";
import { Action } from "@utils/Action";
import ImageIcon from "@components/ui/icons/ImageIcon";

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
    const navigate = useNavigate();
    const [isAddStockOpen, setIsAddStockOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        null,
    );

    const handleOpenAddStockModal = (productId: string) => {
        setSelectedProductId(productId);
        setIsAddStockOpen(true);
    };

    const handleDeleteProduct = async (product) => {
        try {
            await ProductsProvider.deleteProduct(product.id);
            await mutate();
            addToast({
                color: "success",
                title: t("products.table.actions.delete.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (error) {
            console.error(error);
            addToast({
                color: "danger",
                title: t("products.table.actions.delete.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    if (error) return <div>{t("errors.message")}</div>;

    return (
        <ProductsContext.Provider value={{ mutate }}>
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
                            {t("suppliers.add.button")}
                        </Button>
                    </div>
                </div>

                {isMobile ? (
                    <GenericAccordionListMobile
                        items={products?.data || []}
                        isLoading={isLoading}
                        emptyContent={t("products.empty")}
                        getKey={(product) => product.id}
                        getHeaderContent={(product) => (
                            <div className="flex items-center gap-3">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-zinc-500 bg-opacity-20 rounded-lg flex justify-center items-center">
                                        <ImageIcon color="gray" size={24} />
                                    </div>
                                )}
                                <div>
                                    <span className="font-semibold text-base">
                                        {product.name}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-0.5">
                                        {product.reference}
                                    </div>
                                </div>
                            </div>
                        )}
                        getBodyContent={(product) => (
                            <div>
                                <div>
                                    <span className="font-medium">
                                        {t("products.table.headers.location")}
                                        :{" "}
                                    </span>
                                    {product.location}
                                </div>
                                <div>
                                    <span className="font-medium">
                                        {t("products.table.headers.stock")}
                                        :{" "}
                                    </span>
                                    {product.stock}
                                </div>
                                <div>
                                    <span className="font-medium">
                                        {t("products.table.headers.price")}
                                        :{" "}
                                    </span>
                                    {product.price} €
                                </div>
                                <div>
                                    <span className="font-medium">
                                        {t("products.table.headers.name")}:{" "}
                                    </span>
                                    {product.category?.name}
                                </div>
                                <div className="text-xs text-light-400 mt-1">
                                    {product.description}
                                </div>
                            </div>
                        )}
                        getActions={(product) => [
                            {
                                label: t("products.table.actions.edit"),
                                variant: "default",
                                onClick: () => {
                                    navigate(`/stocks/${product.id}/edit`);
                                },
                            },
                            {
                                label: t("products.table.actions.add_stocks"),
                                variant: "default",
                                onClick: () => {
                                    handleOpenAddStockModal(product.id);
                                },
                            },
                            {
                                label: t("products.table.actions.delete.title"),
                                variant: "danger",
                                onClick: Action.create(async () => {
                                    await handleDeleteProduct(product);
                                })
                                    .confirm(
                                        t(
                                            "products.table.actions.delete.dialog.title",
                                        ),
                                        t(
                                            "products.table.actions.delete.dialog.message",
                                            { name: product.name },
                                        ),
                                        "danger",
                                        t(
                                            "products.table.actions.delete.dialog.confirm",
                                        ),
                                        t("generics.cancel"),
                                    )
                                    .build(),
                            },
                        ]}
                        showViewButton={true}
                        onView={(product) => navigate(`/stocks/${product.id}`)}
                        mutate={mutate}
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

                <Outlet />
            </div>
        </ProductsContext.Provider>
    );
}
