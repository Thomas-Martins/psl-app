import CustomersPage from "@pages/CustomersPage.tsx";
import { RouteConfig } from "../RouteConfig.ts";
import CustomerDetailDrawer from "@components/Intranet/Clients/CustomerDetailDrawer.tsx";
import CustomerEditModal from "@components/Intranet/Clients/CustomerEditModal.tsx";

export const customersRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "customers",
        element: <CustomersPage />,
        children: [
            {
                path: ":customerId",
                element: <CustomerDetailDrawer />,
            },
            {
                path: ":customerId/edit",
                element: (
                    <CustomerEditModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
        ],
    },
];
