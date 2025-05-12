import {
    addToast,
    Avatar,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { User } from "@/types/Users";
import UsersProvider from "@/core/api/Providers/UsersProvider";
import { useTranslation } from "react-i18next";
import RoleChip from "@components/ui/global/RoleChip.tsx";

interface UserInfoModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
export default function UserInfoModal({
    isOpen,
    onOpenChange,
}: UserInfoModalProps) {
    const { userId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const effectiveIsOpen = Boolean(userId) || isOpen;

    const [user, setUser] = useState<User | null>(null);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        const id = parseInt(userId, 10);
        if (isNaN(id)) {
            console.error("userId is not a valid number:", userId);
            navigate("/users");
            addToast({
                color: "danger",
                title: t("generics.errors.surprise"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
            return;
        }
        try {
            const response = await UsersProvider.getUser(id);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            addToast({
                color: "danger",
                title: t("generics.errors.surprise"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
            navigate("/users");
        }
    }, [userId, navigate, t]);

    const handleModalOpenChange = (open: boolean) => {
        if (!open) {
            navigate("/users");
        }
        onOpenChange(open);
    };

    const handleEditClick = () => {
        if (userId) {
            navigate(`/users/${userId}/edit`, {
                state: { user: user },
            });
        }
    };

    useEffect(() => {
        if (userId) {
            (async () => {
                await fetchUser();
            })();
        }
    }, [userId, fetchUser]);

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-row items-center gap-3">
                    <Avatar
                        className="h-20 w-20"
                        src={user?.image_url}
                        name={user?.identity}
                    />
                    <div>
                        <h2>{user?.identity}</h2>
                        {user?.role && <RoleChip role={user?.role} />}
                    </div>
                </ModalHeader>
                <ModalBody>
                    <h3 className="underline font-medium">
                        {t("carriers.add.inputs.title")}
                    </h3>
                    <div className="text-light-500 text-sm flex flex-row gap-8">
                        <div className="space-y-2">
                            <p> {t("carriers.add.inputs.email")}:</p>
                            <p> {t("carriers.add.inputs.phone")}:</p>
                            <p> {t("carriers.add.inputs.address")}:</p>
                        </div>
                        <div className="space-y-2">
                            <p>{user?.email}</p>
                            <p>{user?.phone}</p>
                            <p>
                                {user?.address +
                                    ", " +
                                    user?.zipcode +
                                    ", " +
                                    user?.city}
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={handleEditClick}>
                        {t("generics.edit")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
