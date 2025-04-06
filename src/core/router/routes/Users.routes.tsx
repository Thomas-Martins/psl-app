import { RouteConfig } from "@core/router/RouteConfig.ts";
import UsersPage from "@pages/UsersPage.tsx";

export const usersRoutes: RouteConfig[] = [
    {
        path: "users",
        element: <UsersPage />,
    }
];
