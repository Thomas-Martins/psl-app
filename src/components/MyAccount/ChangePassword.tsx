import { addToast, Button, Input } from "@heroui/react";
import { useCallback, useState } from "react";
import ToggleVisibilityPassword from "@components/ui/Form/ToggleVisibilityPassword.tsx";
import { useTranslation } from "react-i18next";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import { validators } from "@/utils/InputForm.validators.ts";

export default function ChangePassword() {
    const { t } = useTranslation();
    const user = useSelector((state: RootState) => state.user);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<{
        newPassword?: string;
        confirmPassword?: string;
        currentPassword?: string;
    }>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const currentPasswordError = !currentPassword
            ? t("account.changePassword.errors.currentPassword.required")
            : null;
        const newPasswordError = validators.password(newPassword);
        const confirmPasswordError = validators.confirmPassword(
            confirmPassword,
            { password: newPassword },
        );

        const newErrors = {
            currentPassword: currentPasswordError || undefined,
            newPassword: newPasswordError || undefined,
            confirmPassword: confirmPasswordError || undefined,
        };

        setErrors(newErrors);
        return newErrors;
    };

    const handleUpdatePassword = useCallback(async () => {
        const validationErrors = validate();

        if (
            Object.values(validationErrors).some((error) => error !== undefined)
        ) {
            return;
        }

        const payload = {
            password: newPassword,
            password_confirmation: confirmPassword,
            current_password: currentPassword,
        };
        setLoading(true);
        setErrors({});
        try {
            await UsersProvider.updateUserPassword(Number(user.id), payload);
            addToast({
                title: t("account.changePassword.alert.success"),
                color: "success",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
            setNewPassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            setNewPasswordVisible(false);
            setConfirmPasswordVisible(false);
            setCurrentPasswordVisible(false);
        } catch (err) {
            console.error(err);
            addToast({
                title: t("account.changePassword.alert.error"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        } finally {
            setLoading(false);
        }
    }, [newPassword, confirmPassword, currentPassword, user.id, t]);

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl font-semibold">
                {t("account.changePassword.title")}
            </h1>
            <p className="text-gray-600">
                {t("account.changePassword.description")}
            </p>
            <div className="flex flex-col gap-5">
                <div className="flex gap-5">
                    <Input
                        type={newPasswordVisible ? "text" : "password"}
                        label={t("account.changePassword.newPassword.label")}
                        labelPlacement={"outside"}
                        placeholder={t(
                            "account.changePassword.newPassword.placeholder",
                        )}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        errorMessage={errors.newPassword}
                        isInvalid={!!errors.newPassword}
                        endContent={
                            <ToggleVisibilityPassword
                                visible={newPasswordVisible}
                                setVisibility={() =>
                                    setNewPasswordVisible(!newPasswordVisible)
                                }
                            />
                        }
                        autoFocus
                        aria-label={t(
                            "account.changePassword.newPassword.label",
                        )}
                    />
                    <Input
                        type={confirmPasswordVisible ? "text" : "password"}
                        label={t(
                            "account.changePassword.confirmPassword.label",
                        )}
                        labelPlacement={"outside"}
                        placeholder={t(
                            "account.changePassword.confirmPassword.placeholder",
                        )}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        errorMessage={errors.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                        endContent={
                            <ToggleVisibilityPassword
                                visible={confirmPasswordVisible}
                                setVisibility={() =>
                                    setConfirmPasswordVisible(
                                        !confirmPasswordVisible,
                                    )
                                }
                            />
                        }
                        aria-label={t(
                            "account.changePassword.confirmPassword.label",
                        )}
                    />
                </div>
                <Input
                    type={currentPasswordVisible ? "text" : "password"}
                    label={t("account.changePassword.currentPassword.label")}
                    labelPlacement={"outside"}
                    placeholder={t(
                        "account.changePassword.currentPassword.placeholder",
                    )}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    errorMessage={errors.currentPassword}
                    isInvalid={!!errors.currentPassword}
                    endContent={
                        <ToggleVisibilityPassword
                            visible={currentPasswordVisible}
                            setVisibility={() =>
                                setCurrentPasswordVisible(
                                    !currentPasswordVisible,
                                )
                            }
                        />
                    }
                    aria-label={t(
                        "account.changePassword.currentPassword.label",
                    )}
                />
            </div>
            <div className="flex justify-end">
                <Button
                    isDisabled={
                        !newPassword || !confirmPassword || !currentPassword
                    }
                    color="primary"
                    isLoading={loading}
                    onPress={handleUpdatePassword}
                >
                    {t("account.changePassword.updateButton")}
                </Button>
            </div>
        </div>
    );
}
