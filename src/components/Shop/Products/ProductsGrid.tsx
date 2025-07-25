import { Link } from "react-router";
import { PaginatedProducts } from "@/types/Products.ts";
import ProductCard from "@components/Shop/Products/ProductCard.tsx";
import ProductsList from "@components/Shop/Products/ProductsList.tsx";
import { ProductViewType } from "@/contexts/Products/ProductViewContextInstance";

interface ProductsGridProps {
    products: PaginatedProducts | undefined;
    view?: ProductViewType;
}

export default function ProductsGrid({
    products,
    view = "grid",
}: ProductsGridProps) {
    if (view === "list") {
        return <ProductsList products={products} />;
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {products?.data?.map((product) => (
                <Link
                    key={product.id}
                    to={`${product.id}`}
                    className="block hover:opacity-90 transition-opacity"
                >
                    <ProductCard item={product} />
                </Link>
            ))}
        </div>
    );
}
