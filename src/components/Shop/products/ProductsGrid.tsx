import { PaginatedProducts } from "@/types/Products.ts";
import ProductCard from "@components/Shop/products/ProductCard.tsx";

interface ProductsGridProps {
    products: PaginatedProducts | undefined;
}
export default function ProductsGrid({ products }: ProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products?.data?.map((product) => (
                <ProductCard item={product} key={product.id} />
            ))}
        </div>
    );
}
