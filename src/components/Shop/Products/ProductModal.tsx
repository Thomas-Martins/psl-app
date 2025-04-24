import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    NumberInput,
} from "@heroui/react";
import { Product } from "@/types/Products.ts";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import { useDispatch } from "react-redux";
import { addItem } from "@store/cartSlice.ts";
import { useTranslation } from "react-i18next";

interface ProductModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductModal({
    isOpen,
    onOpenChange,
}: ProductModalProps) {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const effectiveIsOpen = Boolean(id) || isOpen;
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            onOpenChange(true);
        }
        return () => {
            onOpenChange(false);
        };
    }, [id]);

    const fetchProduct = useCallback(async () => {
        if (!id) return;
        try {
            const { data } = await ProductsProvider.getProduct(Number(id));
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleModalClose = (open: boolean) => {
        if (!open) {
            navigate(-1);
        }
        onOpenChange(open);
    };

    const handleAddToCart = () => {
        if (product) {
            dispatch(addItem({ ...product, quantity }));
            addToast({
                title: t("cart.add.toast.success"),
                color: "success",
                classNames: {
                    icon: "w-6 h-6 fill-green-600",
                    closeButton: "border-none",
                },
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
            handleModalClose(false);
        } else {
            addToast({
                title: t("cart.add.toast.error"),
                color: "danger",
                classNames: {
                    icon: "w-6 h-6 fill-red-600",
                    closeButton: "border-none",
                },
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
        }
    };

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalClose}>
            <ModalContent>
                <ModalBody className="px-6 py-8">
                    {product?.image_url ? (
                        <img
                            alt={product?.name}
                            className="w-full object-cover h-60 rounded-2xl"
                            src={product?.image_url}
                            width="100%"
                        />
                    ) : (
                        <div className="bg-light-200 flex flex-col justify-center items-center h-60 rounded-2xl">
                            <ImageIcon size={50} color={"white"} />
                        </div>
                    )}
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-xl font-bold">{product?.name}</h2>
                        <p className="text-light-300">€{product?.price}</p>
                    </div>
                    <div>
                        <NumberInput
                            aria-label="Amount"
                            label={t("cart.add.quantity")}
                            labelPlacement="outside"
                            defaultValue={1}
                            onChange={(value) => {
                                const newQty =
                                    typeof value === "number"
                                        ? value
                                        : Number(value.target.value);

                                setQuantity(newQty < 1 ? 1 : newQty);
                            }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex flex-row w-full gap-2">
                        <Button
                            className="w-full"
                            variant="light"
                            onPress={() => handleModalClose(false)}
                        >
                            {t("cart.add.back.button")}
                        </Button>
                        <Button
                            className="w-full"
                            color="primary"
                            onPress={handleAddToCart}
                        >
                            {t("cart.add.label")}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
