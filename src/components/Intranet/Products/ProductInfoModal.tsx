import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Product } from "@/types/Products.ts";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { addToast, Image, Modal, ModalBody, ModalContent } from "@heroui/react";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";

interface ProductInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function ProductInfoModal({
    isOpen,
    onOpenChange,
}: ProductInfoModalProps) {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(productId) || isOpen;

    const [product, setProduct] = useState<Product | null>(null);

    const fetchProduct = useCallback(async () => {
        if (!productId) return;
        const id = parseInt(productId, 10);
        if (isNaN(id)) {
            console.error("productId is not a valid number:", productId);
            navigate("/stocks");
            addToast({
                color: "danger",
                title: t("generics.errors.surprise"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
            return;
        }
        try {
            const response = await ProductsProvider.getProduct(id);
            setProduct(response.data.data);
        } catch (error) {
            console.error("Error fetching product:", error);
            console.error("Error fetching user:", error);
            addToast({
                color: "danger",
                title: t("generics.errors.surprise"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
            navigate("/stocks");
        }
    }, [productId, navigate, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/stocks");
        }
        onOpenChange(open);
    };

    useEffect(() => {
        if (productId) {
            (async () => {
                await fetchProduct();
            })();
        }
    }, [productId, fetchProduct]);

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalOpenChange}>
            <ModalContent>
                <ModalBody className="py-6">
                    {product && product.image_url ? (
                        <Image
                            src={product?.image_url}
                            height={240}
                            width="100%"
                            className="object-cover"
                        />
                    ) : (
                        <div className="bg-zinc-500 bg-opacity-20 flex flex-col justify-center items-center w-full h-60 rounded-lg">
                            <ImageIcon size={50} color={"white"} />
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <div className="flex gap-2 items-baseline">
                                <h2 className="text-xl font-bold">
                                    {product?.name}
                                </h2>
                                <p className="text-zinc-500 text-sm">
                                    {product?.category.name}
                                </p>
                            </div>
                            <p className="text-zinc-500 text-sm">
                                {product?.price} €
                            </p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <p className="text-sm">
                                    {t("products.table.headers.reference") +
                                        " : " +
                                        product?.reference}
                                </p>
                                <p className="text-sm">
                                    {t("products.table.headers.location") +
                                        " : " +
                                        product?.location}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-sm">
                                    {t("products.table.headers.supplier") +
                                        " : " +
                                        product?.supplier.name}
                                </p>
                                <p className="text-sm">
                                    {t("products.table.headers.stock") +
                                        " : " +
                                        product?.stock}{" "}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm">
                                {t("products.table.headers.description") +
                                    " : " +
                                    product?.description}
                            </p>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
