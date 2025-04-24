import { useEffect, useState } from "react";
import CategoriesProvider from "@core/api/Providers/CategoriesProvider.ts";
import { Category } from "@/types/Categories.ts";
import { Card, CardFooter, Image } from "@heroui/react";
import { Link } from "react-router";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        CategoriesProvider.getCategories().then((res) => {
            setCategories(res.data);
        });
    }, []);
    return (
        <>
            <div className="grid grid-cols-5 gap-5">
                {categories.map((category) => (
                    <Link
                        className="w-full text-center"
                        to={`${category.id}/products`}
                    >
                        <Card
                            key={category.id}
                            className="border-none"
                            radius="lg"
                            isFooterBlurred
                        >
                            {category.image_url ? (
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl"
                                    src={category.image_url}
                                    height={225}
                                />
                            ) : (
                                <div className="bg-light-100 h-56 rounded-xl flex items-center justify-center">
                                    <ImageIcon size={50} color="white" />
                                </div>
                            )}

                            <CardFooter className="flex p-2 before:bg-white/10 border-white/20 border-1 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                <p className="text-xs">
                                    {category.name} {category.id}
                                </p>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
}
