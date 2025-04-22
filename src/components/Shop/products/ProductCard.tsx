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
                            className="w-full object-cover h-36"
                            src={item.image_url}
                            width="100%"
                        />
                    ) : (
                        <div className="bg-light-200 flex flex-col justify-center items-center h-36">
                            <ImageIcon size={50} color={"white"} />
                        </div>
                    )}
                </CardBody>
                <CardFooter className="flex justify-between">
                    <h2 className="text-xs font-bold">{item.name}</h2>
                    <p className="text-xs text-light-300">€{item.price}</p>
                </CardFooter>
            </Card>
        </div>
    );
}
