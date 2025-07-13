import { useTranslation } from "react-i18next";
import GenericAccordionListMobile from "@components/ui/global/GenericAccordionListMobile";
import { User } from "@/types/Users";
import { useNavigate } from "react-router";
import UsersProvider from "@core/api/Providers/UsersProvider";
import { Action } from "@utils/Action";
import { addToast } from "@heroui/react";
import RoleChip from "@components/ui/global/RoleChip";
import { Avatar } from "@heroui/react";

interface UsersAccordionListMobileProps {
    users: User[];
    isLoading: boolean;
    mutate?: () => Promise<unknown>;
    authenticatedUserId?: string;
}

export default function UsersAccordionListMobile({
    users,
    isLoading,
    mutate,
    authenticatedUserId,
}: UsersAccordionListMobileProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleDeleteUser = async (user: User) => {
        try {
            await UsersProvider.deleteUser(user.id);
            if (mutate) await mutate();
            addToast({
                title: t("users.table.actions.delete.success"),
                color: "success",
            });
        } catch (e) {
            console.error(e);
            addToast({
                title: t("users.table.actions.delete.error"),
                color: "danger",
            });
        }
    };

    return (
        <GenericAccordionListMobile
            items={users}
            isLoading={isLoading}
            emptyContent={t("users.empty")}
            getKey={(user) => user.id}
            getHeaderContent={(user) => (
                <div className="flex items-center gap-3">
                    <Avatar src={user.image_url} name={user.identity} />
                    <div>
                        <span className="font-semibold text-base">
                            {user.identity}
                        </span>
                        <div className="text-xs text-gray-500 mt-0.5">
                            {user.email}
                        </div>
                    </div>
                </div>
            )}
            getBodyContent={(user) => (
                <div>
                    <div>
                        <span className="font-medium">
                            {t("users.table.headers.role")}:{" "}
                        </span>
                        <RoleChip role={user.role} />
                    </div>
                    <div>
                        <span className="font-medium">
                            {t("users.table.headers.phone")}:{" "}
                        </span>
                        {user.phone}
                    </div>
                </div>
            )}
            getActions={(user) => [
                {
                    label: t("users.table.actions.edit"),
                    variant: "default",
                    onClick: () => {
                        if (
                            authenticatedUserId &&
                            user.id === authenticatedUserId
                        ) {
                            navigate("/my-account");
                        } else {
                            navigate(`/users/${user.id}/edit`);
                        }
                    },
                },
                {
                    label: t("users.table.actions.delete.title"),
                    variant: "danger",
                    onClick: Action.create(async () => {
                        await handleDeleteUser(user);
                    })
                        .confirm(
                            t("users.table.actions.delete.dialog.title"),
                            t("users.table.actions.delete.dialog.message", {
                                name: user.firstname + " " + user.lastname,
                            }),
                            "danger",
                            t("users.table.actions.delete.dialog.confirm"),
                            t("generics.cancel"),
                        )
                        .build(),
                },
            ]}
            showViewButton={true}
            onView={(user) => navigate(`/users/${user.id}`)}
        />
    );
}
