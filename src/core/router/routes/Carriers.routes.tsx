import CarriersPage from "@pages/CarriersPage.tsx";
import { RouteConfig } from "@core/router/RouteConfig.ts";
import CarrierInfoModal from "@components/Intranet/Carriers/CarrierInfoModal.tsx";
import CarrierEditModal from "@components/Intranet/Carriers/CarrierEditModal.tsx";

export const carriersRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "carriers",
        element: <CarriersPage />,
        children: [
            {
                path: ":carrierId",
                element: (
                    <CarrierInfoModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
            {
                path: ":carrierId/edit",
                element: (
                    <CarrierEditModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
        ],
    },
];
