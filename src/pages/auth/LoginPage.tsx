import { Button, Input } from "@heroui/react";
import { useState } from "react";
import ToggleVisibilityPassword from "@components/ui/Form/ToggleVisibilityPassword.tsx";
import LoginProvider from "@core/api/Providers/LoginProvider.ts";
import { useTranslation } from "react-i18next";
import ToggleLanguage from "@components/tools/ToggleLanguage.tsx";
import { useDispatch } from "react-redux";
import { setUser } from "@store/userSlice.ts";
import { useNavigate } from "react-router";
import GlobalAlert from "@components/ui/global/GlobalAlert.tsx";
import CartsProvider from "@core/api/Providers/CartsProvider.ts";
import { clearCart, setCart } from "@store/cartSlice.ts";

export default function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            setErrorMessage("");
            const response = await LoginProvider.login({ email, password });
            const { user, access_token } = response.data;

            localStorage.setItem("psl_access_token", access_token);
            dispatch(setUser(user));

            try {
                const cartResp = await CartsProvider.getCartByUserId(user.id);
                const products = cartResp.data?.data?.products;
                if (Array.isArray(products) && products.length > 0) {
                    dispatch(setCart(products));
                } else {
                    dispatch(clearCart());
                }
            } catch (cartError) {
                console.error(
                    "Erreur lors de la récupération du panier :",
                    cartError,
                );
                dispatch(clearCart());
            }

            navigate("/");
        } catch (loginError) {
            console.error(loginError);
            setErrorMessage(t("errors.login.invalid"));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (email.trim() && password.trim()) {
                handleLogin();
            }
        }
    };

    return (
        <div className="flex flex-col h-screen lg:flex-row ">
            <div className="py-14 px-6 flex flex-col gap-16 h-full lg:min-w-[30%] lg:px-12 lg:gap-60 shadow-right z-20 xl:max-w-[40%]">
                <div className="flex justify-between items-center gap-16">
                    {/*logo*/}
                    <div className="h-6">
                        <img
                            src="/src/assets/logos/PslSolutions.svg"
                            alt="psl-solutions-logo"
                        />
                    </div>
                    <ToggleLanguage />
                </div>
                <div>
                    <div className="flex flex-col gap-4 ">
                        <Input
                            type="email"
                            label={t("generics.email")}
                            labelPlacement={"outside"}
                            placeholder="example@email.com"
                            errorMessage={t("errors.login.email")}
                            isRequired
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            label={t("generics.password")}
                            labelPlacement={"outside"}
                            placeholder={t("generics.password")}
                            endContent={
                                <ToggleVisibilityPassword
                                    visible={passwordVisible}
                                    setVisibility={() =>
                                        setPasswordVisible(!passwordVisible)
                                    }
                                />
                            }
                            errorMessage={t("errors.login.password")}
                            isRequired
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex justify-end">
                            <Button color="primary" onPress={handleLogin}>
                                {t("generics.login_btn")}
                            </Button>
                        </div>
                        {errorMessage && (
                            <GlobalAlert
                                type="danger"
                                hideIcon
                                title={errorMessage}
                                variant="solid"
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex ">
                <img
                    className={"object-cover w-full h-full"}
                    src="/img/login-bg.jpg"
                    alt="background-image"
                />
            </div>
        </div>
    );
}
