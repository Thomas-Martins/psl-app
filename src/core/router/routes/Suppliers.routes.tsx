import { RouteConfig } from "@core/router/RouteConfig.ts";
import SuppliersPage from "@pages/SuppliersPage.tsx";
import SupplierInfoModal from "@components/Intranet/Suppliers/SupplierInfoModal.tsx";
import SupplierEditModal from "@components/Intranet/Suppliers/SupplierEditModal.tsx";

export const suppliersRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "suppliers",
        element: <SuppliersPage />,
        children: [
            {
                path: ":supplierId",
                element: (
                    <SupplierInfoModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
            {
                path: ":supplierId/edit",
                element: (
                    <SupplierEditModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
        ],
    },
];
