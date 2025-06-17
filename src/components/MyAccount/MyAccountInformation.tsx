import { addToast, Button, Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import { useEffect, useRef, useState } from "react";
import UploadFileIcon from "@/components/ui/icons/UploadFileIcon";
import UsersProvider from "@core/api/Providers/UsersProvider.ts";
import { updateUser } from "@store/userSlice.ts";
import { useTranslation } from "react-i18next";

export default function MyAccountInformation() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [loading, setLoading] = useState(false);
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [zipcode, setZipcode] = useState(user.zipcode);
    const [city, setCity] = useState(user.city);
    const [previewImage, setPreviewImage] = useState<string>(
        user.image_url || "",
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        return () => {
            if (previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const uploadProfileImage = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await UsersProvider.uploadUserImage(
            Number(user.id),
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

        const objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);

        try {
            const { image_url } = await uploadProfileImage(file);
            dispatch(updateUser({ image_url }));
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
            setPreviewImage(user.image_url || "");
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (!firstname) {
            newErrors.firstname = t("generics.errors.add.firstname.required");
            isValid = false;
        } else if (firstname.length < 3) {
            newErrors.firstname = t("generics.errors.add.firstname.value");
            isValid = false;
        }

        if (!lastname) {
            newErrors.lastname = t("generics.errors.add.lastname.required");
            isValid = false;
        } else if (lastname.length < 3) {
            newErrors.lastname = t("generics.errors.add.lastname.value");
            isValid = false;
        }

        if (!email) {
            newErrors.email = t("generics.errors.add.email.required");
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = t("generics.errors.add.email.value");
            isValid = false;
        }

        if (!phone) {
            newErrors.phone = t("generics.errors.add.phone.required");
            isValid = false;
        } else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = t("generics.errors.add.phone.value");
            isValid = false;
        }

        if (!address) {
            newErrors.address = t("generics.errors.add.address.required");
            isValid = false;
        }

        if (!zipcode) {
            newErrors.zipcode = t("generics.errors.add.zipcode.required");
            isValid = false;
        } else if (!/^\d{5}$/.test(zipcode)) {
            newErrors.zipcode = t("generics.errors.add.zipcode.value");
            isValid = false;
        }

        if (!city) {
            newErrors.city = t("generics.errors.add.city.required");
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdateUser = async () => {
        if (!validate()) return;

        const payload = {
            firstname,
            lastname,
            email,
            phone,
            address,
            zipcode,
            city,
        };
        setLoading(true);

        try {
            const res = await UsersProvider.updateUser(
                Number(user.id),
                payload,
            );
            if (!res || !res.data) throw new Error("Response invalide");
            dispatch(updateUser(res.data));
            addToast({
                title: t("generics.errors.edit.success"),
                color: "success",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
        } catch (err) {
            console.error(err);
            addToast({
                title: t("generics.errors.edit.error"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
                <div
                    className="w-24 h-24 bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:bg-light-800 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt={t("users.add.inputs.image.alt")}
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

            <div className="flex gap-5">
                <Input
                    type="text"
                    label={t("users.add.inputs.lastname")}
                    labelPlacement="outside"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    errorMessage={errors.lastname}
                    isInvalid={!!errors.lastname}
                />
                <Input
                    type="text"
                    label={t("users.add.inputs.firstname")}
                    labelPlacement="outside"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    errorMessage={errors.firstname}
                    isInvalid={!!errors.firstname}
                />
            </div>
            <div className="flex gap-5">
                <Input
                    type="text"
                    label={t("users.add.inputs.email")}
                    labelPlacement="outside"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                />
                <Input
                    type="text"
                    label={t("users.add.inputs.phone")}
                    labelPlacement="outside"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    errorMessage={errors.phone}
                    isInvalid={!!errors.phone}
                />
            </div>
            <Input
                type="text"
                label={t("users.add.inputs.address")}
                labelPlacement="outside"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                errorMessage={errors.address}
                isInvalid={!!errors.address}
            />
            <div className="flex gap-5">
                <Input
                    type="text"
                    label={t("users.add.inputs.zipcode")}
                    labelPlacement="outside"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    errorMessage={errors.zipcode}
                    isInvalid={!!errors.zipcode}
                />
                <Input
                    type="text"
                    label={t("users.add.inputs.city")}
                    labelPlacement="outside"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    errorMessage={errors.city}
                    isInvalid={!!errors.city}
                />
            </div>

            <div className="flex justify-end">
                <Button
                    color="primary"
                    isLoading={loading}
                    onPress={handleUpdateUser}
                >
                    {t("generics.save")}
                </Button>
            </div>
        </div>
    );
}
