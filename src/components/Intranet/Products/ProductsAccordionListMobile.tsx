import { useTranslation } from "react-i18next";
import { Image } from "@heroui/react";
import { useNavigate } from "react-router";
import { Product } from "@/types/Products.ts";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import ImageIcon from "@components/ui/icons/ImageIcon";
import { Action } from "@utils/Action";
import { addToast } from "@heroui/react";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { KeyedMutator } from "swr";
import { PaginatedProducts } from "@/types/Products.ts";

interface ProductsAccordionListMobileProps {
    products: Product[];
    isLoading: boolean;
    mutate: KeyedMutator<PaginatedProducts>;
    onOpenAddStockModal: (productId: string) => void;
}

export default function ProductsAccordionListMobile({
    products,
    isLoading,
    mutate,
    onOpenAddStockModal,
}: ProductsAccordionListMobileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDeleteProduct = async (product: Product) => {
        try {
            await ProductsProvider.deleteProduct(product.id);
            await mutate();
            addToast({
                color: "success",
                title: t("products.table.actions.delete.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (error) {
            console.error(error);
            addToast({
                color: "danger",
                title: t("products.table.actions.delete.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    return (
        <GenericAccordionListMobile
            items={products}
            isLoading={isLoading}
            emptyContent={t("products.table.empty")}
            getKey={(product) => product.id}
            getHeaderContent={(product) => (
                <div className="flex items-center gap-3">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-zinc-500 bg-opacity-20 rounded-lg flex justify-center items-center">
                            <ImageIcon color="gray" size={24} />
                        </div>
                    )}
                    <div>
                        <span className="font-semibold text-base">
                            {product.name}
                        </span>
                        <div className="text-xs text-gray-500 mt-0.5">
                            {product.reference}
                        </div>
                    </div>
                </div>
            )}
            getBodyContent={(product) => (
                <div>
                    <div>
                        <span className="font-medium">
                            {t("products.table.headers.location")}:{" "}
                        </span>
                        {product.location}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("products.table.headers.stock")}:{" "}
                        </span>
                        {product.stock}
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("products.table.headers.price")}:{" "}
                        </span>
                        {product.price} €
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("products.table.headers.name")}:{" "}
                        </span>
                        {product.category?.name}
                    </div>
                    <div className="text-xs text-light-400 mt-1">
                        {product.description}
                    </div>
                </div>
            )}
            getActions={(product) => [
                {
                    label: t("products.table.actions.edit"),
                    variant: "default",
                    onClick: () => {
                        navigate(`/stocks/${product.id}/edit`);
                    },
                },
                {
                    label: t("products.table.actions.add_stocks"),
                    variant: "default",
                    onClick: () => {
                        onOpenAddStockModal(product.id);
                    },
                },
                {
                    label: t("products.table.actions.delete.title"),
                    variant: "danger",
                    onClick: Action.create(async () => {
                        await handleDeleteProduct(product);
                    })
                        .confirm(
                            t("products.table.actions.delete.dialog.title"),
                            t("products.table.actions.delete.dialog.message", {
                                name: product.name,
                            }),
                            "danger",
                            t("products.table.actions.delete.dialog.confirm"),
                            t("generics.cancel"),
                        )
                        .build(),
                },
            ]}
            showViewButton={true}
            onView={(product) => navigate(`/stocks/${product.id}`)}
        />
    );
}
