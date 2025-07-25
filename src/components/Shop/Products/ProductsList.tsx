import { Link } from "react-router";

import { PaginatedProducts } from "@/types/Products.ts";
import ImageIcon from "@/components/ui/icons/ImageIcon";

const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numPrice)
        ? "0,00"
        : numPrice.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });
};

interface ProductsListProps {
    products: PaginatedProducts | undefined;
}

export default function ProductsList({ products }: ProductsListProps) {
    return (
        <div className="space-y-3">
            {products?.data?.map((product) => (
                <Link key={product.id} to={`${product.id}`} className="block">
                    <div className="flex items-center  border-b border-zinc-200 pb-2">
                        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-zinc-200">
                                    <span className="text-zinc-400">
                                        <ImageIcon />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 px-4">
                            <div className="font-bold mb-1 truncate">
                                {product.name}
                            </div>
                            <div className="text-zinc-500 text-xs md:text-sm line-clamp-2">
                                {product.description ||
                                    "Lorem ipsum dolor sit amet consectetur. Eget ullamcorper viverra adipiscing ornare. Quis praesent arcu eu malesuada nec lacus neque."}
                            </div>
                        </div>
                        <div className="flex flex-col items-end min-w-[70px]">
                            <span className="text-sm">
                                €{formatPrice(product.price)}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
