import { Link, Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import { PaginatedProducts } from "@/types/Products.ts";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import ProductsGrid from "@components/Shop/Products/ProductsGrid.tsx";
import { usePagination } from "@utils/hook/usePagination.ts";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import { CircularProgress } from "@heroui/react";
import { useTranslation } from "react-i18next";
import GlobalAlert from "@components/ui/global/GlobalAlert.tsx";

export default function CategoryShowPage() {
    const { t } = useTranslation();
    const { categoryId } = useParams<{ categoryId: string }>();
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 20);

    const [products, setProducts] = useState<PaginatedProducts>();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!categoryId) return;
        setErrorMessage("");
        setLoading(true);
        ProductsProvider.getProducts({
            paginate: true,
            page: currentPage,
            limit,
            orderBy: "name",
            orderWay: "ASC",
            categoryId,
        })
            .then((res) => setProducts(res.data))
            .catch((err) => {
                console.error("Erreur chargement produits :", err);
                setErrorMessage(t("categories.products.no_products"));
            })
            .finally(() => setLoading(false));
    }, [categoryId, currentPage, limit, t]);

    return (
        <>
            <div className="space-y-5">
                <Link
                    to="/shop/categories"
                    className="text-sm text-light-500 hover:underline hover:text-black"
                >
                    ← {t("categories.back_to.categories")}
                </Link>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <CircularProgress size="lg" />
                    </div>
                ) : products && products.data.length > 0 ? (
                    <ProductsGrid products={products} />
                ) : (
                    <div className="text-center py-10 text-gray-600">
                        {t("categories.products.no_products")}
                    </div>
                )}

                {!loading && products && products.total > limit && (
                    <PaginateFooter
                        values={["20", "50", "100"]}
                        totalPages={products.last_page || 1}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        itemsPerPage={limit}
                        totalItems={products.total}
                        onLimitChange={(newLimit) =>
                            handleLimitChange(newLimit, products.total)
                        }
                    />
                )}
            </div>
            {errorMessage && (
                <GlobalAlert
                    type="danger"
                    hideIcon
                    title={errorMessage}
                    variant="solid"
                />
            )}
            <Outlet />
        </>
    );
}
