import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import {
    addToast,
    Button,
    CircularProgress,
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
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id && !isOpen) {
            onOpenChange(true);
        }
    }, [id, isOpen, onOpenChange]);

    const handleModalClose = useCallback(
        (open: boolean) => {
            if (!open) {
                setProduct(null);
                setLoading(false);
                setQuantity(1);
                navigate("..", { replace: true, relative: "path" });
            }
            onOpenChange(open);
        },
        [navigate, onOpenChange],
    );

    useEffect(() => {
        if (!id) return;

        let isMounted = true;
        setLoading(true);

        ProductsProvider.getProduct(Number(id))
            .then(({ data }) => {
                if (isMounted) setProduct(data.data);
            })
            .catch((error) => {
                if (isMounted) {
                    console.error("Failed to fetch product:", error);
                    addToast({
                        title: t("generics.errors.surprise"),
                        color: "danger",
                        classNames: {
                            icon: "w-6 h-6 fill-red-600",
                            closeButton: "border-none",
                        },
                        timeout: 2000,
                        shouldShowTimeoutProgress: true,
                    });
                    handleModalClose(false);
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleAddToCart = () => {
        if (!product) {
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
            return;
        }
        if (product.stock < quantity) {
            addToast({
                title: t("generics.errors.surprise"),
                color: "danger",
                classNames: {
                    icon: "w-6 h-6 fill-red-600",
                    closeButton: "border-none",
                },
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }
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
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={handleModalClose}>
            <ModalContent>
                <ModalBody className="px-6 py-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-60">
                            <CircularProgress
                                aria-label="Loading..."
                                size="lg"
                            />
                        </div>
                    ) : product ? (
                        <>
                            {product.image_url ? (
                                <img
                                    alt={product.name}
                                    className="w-full object-cover h-60 rounded-2xl"
                                    src={product.image_url}
                                />
                            ) : (
                                <div className="bg-zinc-500 bg-opacity-20 flex flex-col justify-center items-center h-60 rounded-2xl">
                                    <ImageIcon size={50} color="white" />
                                </div>
                            )}
                            <div className="flex justify-between items-center mt-4">
                                <h2 className="text-xl font-bold">
                                    {product.name}{" "}
                                    <span className="text-zinc-400 text-sm font-normal">
                                        ({product.stock} en stock)
                                    </span>
                                </h2>
                                <p className="text-light-300">
                                    €{product.price}
                                </p>
                            </div>
                            <div className="mt-4">
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
                        </>
                    ) : null}
                </ModalBody>

                {!loading && product && (
                    <ModalFooter>
                        <div className="flex gap-2 w-full">
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
                )}
            </ModalContent>
        </Modal>
    );
}
