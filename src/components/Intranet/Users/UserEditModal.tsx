import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { validators } from "@utils/InputForm.validators";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import UploadFileIcon from "@components/ui/icons/UploadFileIcon.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateUser } from "@/store/userSlice";

interface UserEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function UserEditModal({
    isOpen,
    onOpenChange,
}: UserEditModalProps) {
    const { userId } = useParams<{ userId: string }>();
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { t } = useTranslation();
    const effectiveIsOpen = Boolean(userId) || isOpen;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>(
        state?.user.image_url || "",
    );

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        zipcode: "",
        city: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const init = useCallback(() => {
        if (!state?.user) return;
        setFormData({
            firstname: state?.user?.firstname || "",
            lastname: state?.user?.lastname || "",
            email: state?.user?.email || "",
            phone: state?.user?.phone || "",
            address: state?.user?.address || "",
            zipcode: state?.user?.zipcode || "",
            city: state?.user?.city || "",
        });
    }, [state?.user]);

    useEffect(() => {
        if (state?.user) {
            init();
        }
    }, [state?.user, init]);

    const fieldValidatorMapping: Record<string, string> = {
        firstname: "firstname",
        lastname: "lastname",
        email: "email",
        phone: "phone",
        address: "address",
        zipcode: "zipcode",
        city: "city",
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        const validatorKey = fieldValidatorMapping[field];
        if (validatorKey && validators[validatorKey]) {
            const error = validators[validatorKey](value);
            setErrors((prev) => ({
                ...prev,
                [field]: error || "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach((field) => {
            const validatorKey = fieldValidatorMapping[field];
            if (validatorKey && validators[validatorKey]) {
                const error = validators[validatorKey](
                    formData[field as keyof typeof formData],
                );
                if (error) {
                    newErrors[field] = error;
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            setIsSubmitting(true);
            if (!userId) {
                setIsSubmitting(false);
                return;
            }
            await UsersProvider.updateUser(userId, formData);
            addToast({
                color: "success",
                title: t("users.edit.alert.success"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
            });
            navigate(`/users/${userId}`);
        } catch (error) {
            console.error("Error updating store:", error);
            addToast({
                color: "danger",
                title: t("users.edit.alert.error"),
                timeout: 2500,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const uploadProfileImage = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await UsersProvider.uploadUserImage(
            state.user.id,
            formData,
        );
        if (!res || !res.data?.image_url) {
            throw new Error("UploadResponse invalide");
        }
        return res.data as { image_url: string };
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            addToast({
                title: t("users.edit.alert.image"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);

        try {
            const { image_url } = await uploadProfileImage(file);
            if (user.id === state.user.id) {
                dispatch(updateUser({ image_url }));
            }
            addToast({
                title: t("users.add.inputs.image.success"),
                color: "success",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
        } catch (err) {
            console.error(err);
            addToast({
                title: t("users.add.inputs.image.error"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
            setPreviewImage(state.user.image_url || "");
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        navigate("/users");
    };

    return (
        <Modal
            size="2xl"
            isOpen={effectiveIsOpen}
            onOpenChange={(open) => {
                if (!open) handleClose();
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <h2>{t("users.edit.title")}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-24 h-24 bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:bg-light-800 transition-colors"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt={t(
                                                    "users.add.inputs.image.alt",
                                                )}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <UploadFileIcon color="white" />
                                        )}
                                        <input
                                            type="file"
                                            accept=".jpeg, .jpg, .png"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="font-medium">
                                            {t("users.add.inputs.image.title")}
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            {t("users.add.inputs.image.format")}
                                        </p>
                                    </div>
                                </div>
                                <h3 className="underline font-medium">
                                    {t("users.add.inputs.complementary_info")}
                                </h3>
                                <div className="flex gap-4">
                                    <Input
                                        label={t("users.add.inputs.lastname")}
                                        value={formData.lastname}
                                        onChange={(e) =>
                                            handleChange(
                                                "lastname",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.lastname}
                                        isInvalid={!!errors.lastname}
                                    />
                                    <Input
                                        label={t("users.add.inputs.firstname")}
                                        value={formData.firstname}
                                        onChange={(e) =>
                                            handleChange(
                                                "firstname",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.firstname}
                                        isInvalid={!!errors.firstname}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Input
                                        label={t("users.add.inputs.email")}
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleChange(
                                                "email",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.email}
                                        isInvalid={!!errors.email}
                                    />
                                    <Input
                                        label={t("users.add.inputs.phone")}
                                        value={formData.phone}
                                        onChange={(e) =>
                                            handleChange(
                                                "phone",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.phone}
                                        isInvalid={!!errors.phone}
                                    />
                                </div>
                                <Input
                                    label={t("users.add.inputs.address")}
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                    errorMessage={errors.address}
                                    isInvalid={!!errors.address}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        label={t("users.add.inputs.zipcode")}
                                        value={formData.zipcode}
                                        onChange={(e) =>
                                            handleChange(
                                                "zipcode",
                                                e.target.value,
                                            )
                                        }
                                        errorMessage={errors.zipcode}
                                        isInvalid={!!errors.zipcode}
                                    />
                                    <Input
                                        label={t("users.add.inputs.city")}
                                        value={formData.city}
                                        onChange={(e) =>
                                            handleChange("city", e.target.value)
                                        }
                                        errorMessage={errors.city}
                                        isInvalid={!!errors.city}
                                    />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => {
                                    onClose();
                                    handleClose();
                                }}
                            >
                                {t("generics.cancel")}
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleSubmit}
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                {t("generics.save")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
