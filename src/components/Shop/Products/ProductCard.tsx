import { Product } from "@/types/Products.ts";
import { Card, CardBody, CardFooter } from "@heroui/react";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";

interface ProductCardProps {
    item: Product;
}
export default function ProductCard({ item }: ProductCardProps) {
    return (
        <div>
            <Card>
                <CardBody className="overflow-visible p-0">
                    {item.image_url ? (
                        <img
                            alt={item.name}
                            className="w-full object-cover h-32 md:h-36"
                            src={item.image_url}
                            width="100%"
                        />
                    ) : (
                        <div className="bg-zinc-500 bg-opacity-20 flex flex-col justify-center items-center h-32 md:h-36">
                            <ImageIcon size={35} color={"white"} />
                        </div>
                    )}
                </CardBody>
                <CardFooter className="flex justify-between p-2 md:p-3">
                    <h2 className="text-xs md:text-sm font-bold truncate flex-1 mr-2">
                        {item.name}
                    </h2>
                    <p className="text-xs md:text-sm text-light-300 font-semibold">
                        €{item.price}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
