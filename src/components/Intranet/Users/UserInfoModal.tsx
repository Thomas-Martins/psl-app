import {
    addToast,
    Avatar,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    CircularProgress,
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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await UsersProvider.getUser(userId);
            setUser(response.data.data);
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

    useEffect(() => {
        if (userId) {
            (async () => {
                await fetchUser();
            })();
        }
    }, [userId, fetchUser]);

    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [userId]);

    useEffect(() => {
        if (user && user.image_url && !imageLoaded && !imageError) {
            const timeout = setTimeout(() => setImageLoaded(true), 1000); // 1s
            return () => clearTimeout(timeout);
        }
    }, [user, imageLoaded, imageError]);

    const isLoading = !user || (user.image_url && !imageLoaded && !imageError);

    return (
        <Modal isOpen={effectiveIsOpen} onOpenChange={handleModalOpenChange}>
            <ModalContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-60">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <ModalHeader className="flex flex-row items-center gap-3">
                            {user && user.image_url && !imageError ? (
                                <Avatar
                                    className="h-20 w-20"
                                    src={user.image_url}
                                    name={user.identity}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="h-20 w-20 flex items-center justify-center bg-zinc-500 bg-opacity-20 rounded-full">
                                    <span className="text-white text-2xl">
                                        {user?.identity?.[0] || "?"}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h2>{user?.identity}</h2>
                                {user?.role && <RoleChip role={user?.role} />}
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <h3 className="underline font-medium">
                                {t("users.add.inputs.complementary_info")}
                            </h3>
                            <div className="text-light-500 text-sm flex flex-row gap-8">
                                <div className="space-y-2">
                                    <p> {t("users.add.inputs.email")}:</p>
                                    <p> {t("users.add.inputs.phone")}:</p>
                                </div>
                                <div className="space-y-2 mb-3">
                                    <p>{user?.email}</p>
                                    <p>{user?.phone}</p>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
