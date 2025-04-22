import Navbar from "@layouts/ShopLayout/Navbar.tsx";
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
        ? "grid grid-cols-12 gap-5 mb-5"
        : "grid grid-cols-1 mb-5";

    const mainContentClass = showAside
        ? "col-span-9 p-5 overflow-x-scroll md:overflow-x-hidden"
        : "col-span-1 p-5 overflow-x-scroll md:overflow-x-hidden";

    return (
        <div className="relative z-10 px-3 md:px-6 lg:px-8 ">
            <Navbar />
            <div className={`${gridClass} max-w-screen-xl mx-auto mt-5`}>
                {showAside && (
                    <Card className="md:col-span-3 p-5 max-h-[885px] min-h-[885px]">
                        {asideContent}
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
    );
}
