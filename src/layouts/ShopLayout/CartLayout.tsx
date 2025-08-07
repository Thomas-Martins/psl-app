import { ProductViewProvider } from "@/contexts/Products/ProductViewContext";
import Navbar from "@layouts/ShopLayout/Navbar.tsx";
import { Outlet } from "react-router";

export default function CartLayout() {
    return (
        <ProductViewProvider>
            <div className="relative z-10 px-3 md:px-6 lg:px-8 min-h-screen">
                <Navbar />
                <div className="mb-5 max-w-screen-xl mx-auto mt-5 ">
                    <Outlet />
                </div>
            </div>
        </ProductViewProvider>
    );
}
