import { useEffect, useState } from "react";
import CategoriesProvider from "@core/api/Providers/CategoriesProvider.ts";
import { Category } from "@/types/Categories.ts";
import { Card, CardFooter, CircularProgress, Image } from "@heroui/react";
import { Link } from "react-router";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import GlobalAlert from "@components/ui/global/GlobalAlert.tsx";
import { useTranslation } from "react-i18next";

export default function CategoriesPage() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setErrorMessage("");
        setLoading(true);
        CategoriesProvider.getCategories()
            .then((res) => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setErrorMessage(t("categories.errors.get_categories"));
            });
    }, [t]);

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-2xl">{t("categories._name")}</h1>
            {loading ? (
                <div className="flex justify-center py-10 h-96">
                    <CircularProgress
                        className="stroke-primary-500"
                        size="lg"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-5">
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
                                    <p className="text-xs">{category.name}</p>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
            {errorMessage && (
                <GlobalAlert
                    type="danger"
                    hideIcon
                    title={errorMessage}
                    variant="solid"
                />
            )}
        </div>
    );
}
