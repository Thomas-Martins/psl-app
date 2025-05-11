import StoreInfoModal from "@components/Intranet/Stores/StoreInfoModal.tsx";
import { RouteConfig } from "@core/router/RouteConfig.ts";
import StoresPage from "@pages/StoresPage.tsx";
import StoreEditModal from "@components/Intranet/Stores/StoreEditModal.tsx";

export const storesRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "stores",
        element: <StoresPage />,
        children: [
            {
                path: ":storeId",
                element: (
                    <StoreInfoModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
            {
                path: ":storeId/edit",
                element: (
                    <StoreEditModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
        ],
    },
];
