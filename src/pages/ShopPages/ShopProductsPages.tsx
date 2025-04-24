import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { PaginatedProducts } from "@/types/Products.ts";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import useSWR from "swr";
import ProductsGrid from "@components/Shop/Products/ProductsGrid.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import { useEffect, useMemo, useState } from "react";
import { useShopLayout } from "@utils/hook/useShopLayoutContext.ts";
import ProductsAsideMenu from "@components/Shop/Products/ProductsAsideMenu.tsx";
import {
    ProductFilters,
    ProductFiltersContext,
} from "@/contexts/ProductFiltersContext";
import { Outlet } from "react-router";

const fetchProducts = async (key: string): Promise<PaginatedProducts> => {
    const params = JSON.parse(key);
    const response = await ProductsProvider.getProducts({
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
        ...(params.filters || {}),
    });
    return response.data;
};

export default function ShopProductsPages() {
    const [filters, setFilters] = useState<ProductFilters>({});
    const { orderWay, orderBy } = useSort("name", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 20);

    const swrKey = JSON.stringify({
        key: "products",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        filters: filters,
    });

    const { data: products } = useSWR<PaginatedProducts>(
        swrKey,
        fetchProducts,
        {
            keepPreviousData: true,
        },
    );

    const layout = useShopLayout();

    useEffect(() => {
        layout.setShowAside?.(true);
        return () => {
            layout.setShowAside?.(false);
            layout.setAside?.(null);
        };
    }, [layout]);

    const asideComponent = useMemo(
        () => (
            <ProductFiltersContext.Provider value={{ filters, setFilters }}>
                <ProductsAsideMenu />
            </ProductFiltersContext.Provider>
        ),
        [filters, setFilters],
    );

    useEffect(() => {
        layout.setAside?.(asideComponent);
    }, [asideComponent, layout]);

    return (
        <ProductFiltersContext.Provider value={{ filters, setFilters }}>
            <div className="space-y-5">
                <ProductsGrid products={products} />
                <PaginateFooter
                    values={["20", "50", "100"]}
                    totalPages={products?.last_page || 1}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    itemsPerPage={limit}
                    totalItems={products?.total || 0}
                    onLimitChange={(newLimit) =>
                        handleLimitChange(
                            newLimit,
                            products ? Number(products.total) : 20,
                        )
                    }
                />
            </div>
            <Outlet />
        </ProductFiltersContext.Provider>
    );
}
