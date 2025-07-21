import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { PaginatedProducts } from "@/types/Products.ts";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import useSWR from "swr";
import ProductsGrid from "@components/Shop/Products/ProductsGrid.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShopLayout } from "@utils/hook/useShopLayoutContext.ts";
import ProductsAsideMenu from "@components/Shop/Products/ProductsAsideMenu.tsx";
import MobileFiltersDrawer from "@components/Shop/Products/MobileFiltersDrawer.tsx";
import {
    ProductFilters,
    ProductFiltersContext,
} from "@/contexts/Products/ProductFiltersContext";
import { Outlet } from "react-router";
import { CircularProgress } from "@heroui/progress";
import {
    addToast,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@utils/hook/useMediaQuery.ts";
import PageTitle from "@components/tools/PageTitle";

export default function ShopProductsPages() {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<ProductFilters>({});
    const { orderWay, orderBy } = useSort("name", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 20);

    // Détecte si on est sur mobile
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Gestion du drawer pour les filtres sur mobile
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const fetchProducts = useCallback(
        async (key: string): Promise<PaginatedProducts> => {
            try {
                const params = JSON.parse(key);

                // Filtrer les paramètres vides avant de les envoyer à l'API
                const cleanFilters = Object.entries(
                    params.filters || {},
                ).reduce(
                    (acc, [key, value]) => {
                        // Exclure les tableaux vides et les chaînes vides
                        if (Array.isArray(value) && value.length > 0) {
                            acc[key] = value;
                        } else if (
                            typeof value === "string" &&
                            value.trim() !== ""
                        ) {
                            acc[key] = value;
                        } else if (typeof value === "number") {
                            acc[key] = value;
                        }
                        return acc;
                    },
                    {} as Record<string, unknown>,
                );

                const response = await ProductsProvider.getProducts({
                    paginate: true,
                    page: params.page,
                    limit: params.limit,
                    orderBy: params.orderBy,
                    orderWay: params.orderWay,
                    search: params.search,
                    ...cleanFilters,
                });
                return response.data;
            } catch (e) {
                console.error(e);
                addToast({
                    title: t("products.errors.get_products"),
                    color: "danger",
                    hideIcon: true,
                    timeout: 2500,
                    shouldShowTimeoutProgress: true,
                });
                throw e;
            }
        },
        [t],
    );

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
        // Sur mobile, on masque le menu latéral (on utilise le drawer)
        // Sur desktop, on affiche le menu latéral
        layout.setShowAside?.(!isMobile);
        return () => {
            layout.setShowAside?.(false);
            layout.setAside?.(null);
        };
    }, [layout, isMobile]);

    const asideComponent = useMemo(
        () => (
            <ProductFiltersContext.Provider value={{ filters, setFilters }}>
                <ProductsAsideMenu />
            </ProductFiltersContext.Provider>
        ),
        [filters],
    );

    useEffect(() => {
        // On définit le contenu du menu latéral seulement sur desktop
        if (!isMobile) {
            layout.setAside?.(asideComponent);
        }
    }, [asideComponent, layout, isMobile]);

    return (
        <>
            <PageTitle i18nKey="products._name" />
            {!products || products?.data.length === 0 ? (
                <div className="flex justify-center items-center py-6 md:py-10 h-full min-h-[200px]">
                    <CircularProgress aria-label="Loading..." size="lg" />
                </div>
            ) : (
                <ProductFiltersContext.Provider value={{ filters, setFilters }}>
                    <div className="space-y-3 md:space-y-5">
                        {/* Bouton Filtres pour mobile */}
                        {isMobile && (
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="flat"
                                    onPress={onOpen}
                                    className="flex items-center gap-2"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
                                    </svg>
                                    {t("products.shop.filters._name")}
                                </Button>
                            </div>
                        )}

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

                    {isMobile && (
                        <Drawer
                            isOpen={isOpen}
                            size="md"
                            onOpenChange={onOpenChange}
                            placement="left"
                        >
                            <DrawerContent className="overflow-hidden">
                                <DrawerHeader className="flex flex-col gap-1 border-b bg-content1 px-4 py-3">
                                    <h2 className="text-lg font-semibold">
                                        {t("products.shop.filters._name")}
                                    </h2>
                                </DrawerHeader>
                                <DrawerBody className="p-0 flex flex-col">
                                    <MobileFiltersDrawer
                                        onClose={() => onOpenChange()}
                                    />
                                </DrawerBody>
                            </DrawerContent>
                        </Drawer>
                    )}

                    <Outlet />
                </ProductFiltersContext.Provider>
            )}
        </>
    );
}
