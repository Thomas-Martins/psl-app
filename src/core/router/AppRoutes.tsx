import { Navigate, Route, Routes } from "react-router";
import LoginPage from "@pages/auth/LoginPage.tsx";
import ShopLayout from "@layouts/ShopLayout/ShopLayout.tsx";
import IntranetLayout from "@layouts/IntranetLayout/IntranetLayout.tsx";
import CommandsPage from "@pages/CommandsPage.tsx";
import ClientsPage from "@pages/ClientsPage.tsx";
import StocksPage from "@pages/StocksPage.tsx";
import UsersPage from "@pages/UsersPage.tsx";
import SuppliersPage from "@pages/SuppliersPage.tsx";
import CarriersPage from "@pages/CarriersPage.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";

export default function AppRoutes() {
    const user = useSelector((state: RootState) => state.user);

    const isAuthenticated = Boolean(user && user.role && user.role !== "");

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        user.role === "client" ? (
                            <Navigate to="/shop" />
                        ) : (
                            <Navigate to="/commands" />
                        )
                    ) : (
                        <LoginPage />
                    )
                }
            />

            <Route
                path="/shop"
                element={
                    user.role === "client" ? (
                        <ShopLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/*"
                element={
                    isAuthenticated && user.role !== "client" ? (
                        <IntranetLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route path="commands" element={<CommandsPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="stocks" element={<StocksPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="carriers" element={<CarriersPage />} />

                <Route index element={<Navigate to="commands" />} />
            </Route>
        </Routes>
    );
}
