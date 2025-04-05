import { Navigate, Route, Routes } from "react-router";
import LoginPage from "@pages/auth/LoginPage.tsx";
import ShopLayout from "@layouts/ShopLayout/ShopLayout.tsx";
import IntranetLayout from "@layouts/IntranetLayout/IntranetLayout.tsx";
import CommandsPage from "@pages/CommandsPage.tsx";
import CustomersPage from "@pages/CustomersPage.tsx";
import ProductsPage from "@pages/ProductsPage.tsx";
import UsersPage from "@pages/UsersPage.tsx";
import SuppliersPage from "@pages/SuppliersPage.tsx";
import CarriersPage from "@pages/CarriersPage.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import StoresPage from "@pages/StoresPage.tsx";
import { Role } from "@/types/Role.ts";

export default function AppRoutes() {
    const user = useSelector((state: RootState) => state.user);

    const isAuthenticated = Boolean(user && user.role);

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        user?.role === Role.CLIENT ? (
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
                    user?.role === Role.CLIENT ? (
                        <ShopLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />

            <Route
                path="/*"
                element={
                    isAuthenticated && user?.role !== Role.CLIENT ? (
                        <IntranetLayout />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route path="commands" element={<CommandsPage />} />
                <Route path="clients" element={<CustomersPage />} />
                <Route path="stocks" element={<ProductsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="stores" element={<StoresPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="carriers" element={<CarriersPage />} />

                <Route index element={<Navigate to="commands" />} />
            </Route>
        </Routes>
    );
}
