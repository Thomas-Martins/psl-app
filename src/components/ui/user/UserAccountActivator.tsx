import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import LogoutIcon from "@components/ui/icons/LogoutIcon.tsx";
import { useNavigate } from "react-router";
import RoleChip from "@components/ui/global/RoleChip.tsx";
import { Role } from "@/types/Role.ts";
import { useTranslation } from "react-i18next";
import CartsProvider from "@core/api/Providers/CartsProvider.ts";
import { clearUser } from "@store/userSlice.ts";
import { clearCart } from "@store/cartSlice.ts";

interface UserAccountActivatorProps {
    customer?: boolean;
}

export default function UserAccountActivator({
    customer = false,
}: UserAccountActivatorProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const handleLogout = async () => {
        try {
            if (cartItems.length > 0) {
                await CartsProvider.createCart({
                    products: cartItems,
                });
            } else {
                await CartsProvider.deleteCart(user.id);
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du panier :", error);
        } finally {
            dispatch(clearUser());
            dispatch(clearCart());
            navigate("/login");
        }
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <div className="flex flex-row items-center gap-6 cursor-pointer">
                    {!customer && (
                        <div>
                            <p className="text-white">
                                {user.firstname + " " + user.lastname}
                            </p>
                            <RoleChip role={user.role as Role} />
                        </div>
                    )}
                    <Avatar
                        className="transition-transform"
                        name={user.firstname}
                        size="md"
                        src={user.image_url}
                    />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="solid">
                <DropdownItem
                    key="settings"
                    onPress={() => navigate("/my-account")}
                >
                    {t("global.links.my_account")}
                </DropdownItem>
                {customer ? (
                    <DropdownItem
                        key="orders"
                        onPress={() => navigate("/user/orders")}
                    >
                        {t("global.links.my_orders")}
                    </DropdownItem>
                ) : null}
                <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={handleLogout}
                    className="flex flex-row text-black"
                    startContent={<LogoutIcon size={15} />}
                >
                    {t("global.links.logout")}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
