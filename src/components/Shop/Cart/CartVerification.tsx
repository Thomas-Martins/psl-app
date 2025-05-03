import { addToast, Button, Input, Textarea } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import { useState } from "react";
import CartDetail from "@components/Shop/Cart/CartDetail.tsx";
import { useTranslation } from "react-i18next";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { updateStore } from "@store/userSlice.ts";
import { clearCart } from "@store/cartSlice.ts";
import { useNavigate } from "react-router";
import i18n from "@/core/i18n/i18n";

export default function CartVerification() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((s: RootState) => s.user);
    const cartItems = useSelector((s: RootState) => s.cart.items);

    const [addr, setAddr] = useState(user.store?.address ?? "");
    const [zip, setZip] = useState(user.store?.zipcode ?? "");
    const [city, setCity] = useState(user.store?.city ?? "");
    const [phone, setPhone] = useState(user.store?.phone ?? "");
    const [info, setInfo] = useState("");

    const [loading, setLoading] = useState(false);
    const handleValidateCart = async () => {
        setLoading(true);
        try {
            await UsersProvider.updateUser(user.id, {
                address: addr,
                zipcode: zip,
                city,
                phone,
            });
            dispatch(updateStore({ address: addr, zipcode: zip, city, phone }));

            const payload = {
                user_id: user.id,
                complementary_info: info,
                products: cartItems,
                locale: i18n.language,
            };
            const response = await OrdersProvider.createOrder(payload);

            dispatch(clearCart());
            navigate("/cart/confirmation", {
                state: {
                    orderId: response.data.data.id,
                    order: response.data.data,
                    fromCart: true,
                },
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("cart.error.validate_cart"),
                description: t("generics.errors.retry"),
                color: "danger",
                hideIcon: true,
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-5 gap-4 items-start h-full">
            <div className="bg-white w-full col-span-3 p-5 rounded-2xl flex flex-col gap-3 shadow">
                <h1 className="text-2xl font-medium">
                    {t("cart.info_confirmation")}
                </h1>
                <p className="text-xl mb-4">
                    {t("stores._name")} : {user.store?.name}
                </p>
                <div className="flex gap-3 mb-3">
                    <Input
                        type="text"
                        label={t("users.add.inputs.address")}
                        labelPlacement="outside"
                        isRequired
                        value={addr}
                        onChange={(e) => setAddr(e.target.value)}
                    />
                    <Input
                        type="text"
                        label={t("users.add.inputs.zipcode")}
                        labelPlacement="outside"
                        isRequired
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 mb-3">
                    <Input
                        type="text"
                        label={t("users.add.inputs.city")}
                        labelPlacement="outside"
                        isRequired
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                        type="text"
                        label={t("users.add.inputs.phone")}
                        labelPlacement="outside"
                        isRequired
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <Textarea
                    label={t("users.add.inputs.complementary_info")}
                    labelPlacement="outside"
                    value={info}
                    minRows={4}
                    onChange={(e) => setInfo(e.target.value)}
                />
            </div>

            <div className="bg-white w-full col-span-2 p-5 rounded-2xl shadow flex flex-col justify-between h-full">
                <h1 className="text-2xl font-medium">{t("cart.your_cart")}</h1>
                <CartDetail />
                <Button
                    color="primary"
                    size="lg"
                    isLoading={loading}
                    onPress={handleValidateCart}
                >
                    {t("cart.validate_command")}
                </Button>
            </div>
        </div>
    );
}
