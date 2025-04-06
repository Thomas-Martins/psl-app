import CommandsPage from "@pages/CommandsPage.tsx";
import { RouteConfig } from "../RouteConfig.ts";

export const commandsRoutes: RouteConfig[] = [
    {
        path: "commands",
        element: <CommandsPage />,
    },
];
