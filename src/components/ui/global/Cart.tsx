import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import CartIcon from "@components/ui/icons/CartIcon.tsx";
import {
    Badge,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import CartDetail from "@components/Shop/Cart/CartDetail.tsx";

export default function Cart() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { t } = useTranslation();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const navigate = useNavigate();

    const totalCartItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const handleValidateCart = () => {
        navigate("/cart");
        onOpenChange();
    };

    return (
        <div>
            <Button
                variant="light"
                isIconOnly={true}
                size="lg"
                onPress={onOpen}
            >
                <Badge
                    color="success"
                    content={totalCartItems}
                    showOutline={false}
                    placement="bottom-right"
                    size="sm"
                >
                    <CartIcon size={30} color="white" />
                </Badge>
            </Button>
            <Drawer isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="flex flex-col gap-1">
                        {t("cart._name")}
                        <Divider />
                    </DrawerHeader>
                    <DrawerBody>
                        <CartDetail />
                    </DrawerBody>
                    <DrawerFooter>
                        <Button
                            className="w-full"
                            color="primary"
                            onPress={handleValidateCart}
                            isDisabled={cartItems.length === 0}
                        >
                            {t("cart.validate_cart")}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
