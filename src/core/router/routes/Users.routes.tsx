import UserInfoModal from "@/components/Intranet/Users/UserInfoModal";
import { RouteConfig } from "@core/router/RouteConfig.ts";
import UsersPage from "@pages/UsersPage.tsx";
import UserEditModal from "@components/Intranet/Users/UserEditModal.tsx";

export const usersRoutes = (
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void,
): RouteConfig[] => [
    {
        path: "users",
        element: <UsersPage />,
        children: [
            {
                path: ":userId",
                element: (
                    <UserInfoModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
            {
                path: ":userId/edit",
                element: (
                    <UserEditModal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                    />
                ),
            },
        ],
    },
];
