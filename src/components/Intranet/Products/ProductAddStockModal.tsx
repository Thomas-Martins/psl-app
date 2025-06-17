import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    NumberInput,
} from "@heroui/react";
import { useState } from "react";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { useTranslation } from "react-i18next";

export default function ProductAddStockModal({
    isOpen,
    onOpenChange,
    productId,
    onSuccess,
}: {
    isOpen: boolean;
    onOpenChange: () => void;
    productId: string | null;
    onSuccess: () => void;
}) {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState<number>(0);
    const handleAddStock = async () => {
        if (!quantity) {
            addToast({
                color: "warning",
                title: t("products.edit.stock.required"),
                shouldShowTimeoutProgress: true,
                timeout: 3000,
            });
            return;
        }
        if (!productId) {
            addToast({
                color: "danger",
                title: t("generics.errors.surprise"),
                shouldShowTimeoutProgress: true,
                timeout: 3000,
            });
            return;
        }
        try {
            await ProductsProvider.updateProduct(
                productId,
                { stock: quantity },
                { addStock: true },
            );
            addToast({
                color: "success",
                title: t("products.edit.stock.alert.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
            onSuccess();
        } catch (e) {
            console.error(e);
            addToast({
                color: "danger",
                title: t("products.edit.stock.alert.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
                hideIcon: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>{t("products.edit.stock.title")}</ModalHeader>
                <ModalBody>
                    <NumberInput
                        className="w-full"
                        label={t("products.edit.stock.inputs.quantity.title")}
                        labelPlacement="outside"
                        minValue={0}
                        maxValue={100000}
                        defaultValue={10}
                        onChange={(value) => {
                            if (typeof value === "number") {
                                setQuantity(value);
                            }
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <div className="flex gap-2">
                        <Button
                            color="danger"
                            variant="light"
                            className="w-full"
                            onPress={onOpenChange}
                        >
                            {t("generics.cancel")}
                        </Button>
                        <Button
                            color="primary"
                            className="w-full"
                            onPress={handleAddStock}
                        >
                            {t("generics.add")}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
