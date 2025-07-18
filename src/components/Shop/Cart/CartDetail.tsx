import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import { removeItem, updateItemQuantity } from "@store/cartSlice.ts";
import { Button, Divider, Image, NumberInput } from "@heroui/react";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import TrashIcon from "@components/ui/icons/TrashIcon.tsx";
import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";

interface CartDetailProps {
    showDeliveryAddress?: boolean;
}

export default function CartDetail({
    showDeliveryAddress = false,
}: CartDetailProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const userStore = useSelector((state: RootState) => state.user.store);

    const roundUp = (value: number) => {
        return Math.ceil(value * 100) / 100;
    };

    const formatPrice = (value: number) => {
        return value.toFixed(2);
    };

    const totalHT = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    const tva = roundUp(totalHT * 0.2);
    const totalTTC = roundUp(totalHT + tva);

    const handleRemoveItem = (itemId: string) => {
        dispatch(removeItem(itemId));
    };

    const handleQuantityChange = (
        itemId: string,
        value: number | ChangeEvent<HTMLInputElement>,
    ) => {
        let qty =
            typeof value === "number" ? value : Number(value.target.value);

        if (qty < 1) qty = 1;

        dispatch(updateItemQuantity({ id: itemId, quantity: qty }));
    };

    return (
        <div className="h-full">
            {cartItems.length > 0 ? (
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-[1fr_auto_auto] items-center gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            width={64}
                                            height={64}
                                            alt={item.name}
                                            className="object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <div className="bg-zinc-500 bg-opacity-20 flex justify-center items-center w-16 h-16 rounded-2xl">
                                            <ImageIcon
                                                size={30}
                                                color="white"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-md font-semibold">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity} x €{item.price}
                                        </p>
                                    </div>
                                </div>
                                <NumberInput
                                    size="sm"
                                    className="w-16"
                                    labelPlacement="outside"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(value) =>
                                        handleQuantityChange(item.id, value)
                                    }
                                />
                                <Button
                                    isIconOnly={true}
                                    variant="solid"
                                    color="danger"
                                    className="rounded-full"
                                    size="sm"
                                    onPress={() => handleRemoveItem(item.id)}
                                >
                                    <TrashIcon size={18} color="white" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                        {showDeliveryAddress && userStore && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-sm font-semibold mb-2 text-gray-700">
                                    {t("cart.delivery_address")}
                                </h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <p className="font-medium">
                                        {userStore.name}
                                    </p>
                                    <p>{userStore.address}</p>
                                    <p>
                                        {userStore.zipcode} {userStore.city}
                                    </p>
                                    {userStore.phone && (
                                        <p>
                                            {t("cart.phone")}: {userStore.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <p>{t("cart.total_ht")}</p>
                            <p>€{formatPrice(totalHT)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>{t("cart.tva")}</p>
                            <p>20%</p>
                        </div>
                        <Divider />
                        <div className="flex justify-between items-center">
                            <p>{t("cart.total_ttc")}</p>
                            <p>€{formatPrice(totalTTC)}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-light-500">{t("cart.empty")}</p>
                </div>
            )}
        </div>
    );
}
