import { useTranslation } from "react-i18next";
import useSWR from "swr";
import CategoriesProvider from "@core/api/Providers/CategoriesProvider.ts";
import { Category } from "@/types/Categories.ts";
import {
    addToast,
    Card,
    CardFooter,
    CircularProgress,
    Image,
} from "@heroui/react";
import { Link } from "react-router";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import { useCallback } from "react";
import PageTitle from "@components/tools/PageTitle";

export default function CategoriesPage() {
    const { t } = useTranslation();

    const swrKey = JSON.stringify({ key: "categories" });

    const fetchCategories = useCallback(
        async (key: string): Promise<Category[]> => {
            try {
                JSON.parse(key);
                const res = await CategoriesProvider.getCategories();
                return res.data;
            } catch (e) {
                console.error(e);
                addToast({
                    title: t("categories.errors.get_categories"),
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

    const { data: categories } = useSWR<Category[]>(swrKey, fetchCategories, {
        keepPreviousData: true,
    });

    return (
        <>
            <PageTitle i18nKey="categories._name" />
            {!categories ? (
                <div className="flex justify-center py-10 h-96">
                    <CircularProgress size="lg" aria-label="Loading..." />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            className="w-full text-center"
                            to={`${category.id}/products`}
                        >
                            <Card
                                className="border-none"
                                radius="lg"
                                isFooterBlurred
                            >
                                {category.image_url ? (
                                    <Image
                                        alt={category.name}
                                        className="object-cover rounded-xl"
                                        src={category.image_url}
                                        height={225}
                                    />
                                ) : (
                                    <div className="bg-zinc-500 bg-opacity-20 h-40 md:h-56 rounded-xl flex items-center justify-center">
                                        <div className="w-10 h-10 md:w-12 md:h-12">
                                            <ImageIcon
                                                size={40}
                                                color="white"
                                            />
                                        </div>
                                    </div>
                                )}

                                <CardFooter className="flex p-2 before:bg-white/10 border-white/20 border-1 overflow-hidden absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                    <p className="text-xs md:text-sm">
                                        {category.name}
                                    </p>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
