import Navbar from "@layouts/ShopLayout/Navbar.tsx";
import { ProductViewProvider } from "@/contexts/Products/ProductViewContext";
import { Card } from "@heroui/react";
import { Outlet } from "react-router";
import { ReactNode, useState } from "react";

export type ShopLayoutContext = {
    showAside?: boolean;
    asideContent?: ReactNode;
    setAside?: (content: ReactNode) => void;
    setShowAside?: (visible: boolean) => void;
};

export default function ShopLayout() {
    const [showAside, setShowAside] = useState(false);
    const [asideContent, setAsideContent] = useState<ReactNode>(null);

    // Détermine dynamiquement les classes CSS
    const gridClass = showAside
        ? "grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 mb-5"
        : "grid grid-cols-1 mb-5";

    const mainContentClass = showAside
        ? "md:col-span-9 p-3 md:p-5 overflow-x-scroll md:overflow-x-hidden"
        : "col-span-1 p-3 md:p-5 overflow-x-scroll md:overflow-x-hidden";

    return (
        <ProductViewProvider>
            <div className="relative z-10 px-2 md:px-6 lg:px-8 ">
                <Navbar />
                <div
                    className={`${gridClass} max-w-screen-xl mx-auto mt-3 md:mt-5`}
                >
                    {showAside && (
                        <Card className="md:col-span-3 p-3 md:p-5 max-h-[400px] md:max-h-[885px] min-h-[400px] md:min-h-[885px] mb-3 md:mb-0 overflow-x-hidden w-full max-w-full">
                            <div className="w-full max-w-full overflow-x-hidden h-full">
                                {asideContent}
                            </div>
                        </Card>
                    )}
                    <Card className={mainContentClass}>
                        <Outlet
                            context={{
                                showAside,
                                asideContent,
                                setShowAside,
                                setAside: setAsideContent,
                            }}
                        />
                    </Card>
                </div>
            </div>
        </ProductViewProvider>
    );
}
