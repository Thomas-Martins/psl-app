import React, { useState, useRef } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    Input,
    Form,
    addToast,
} from "@heroui/react";
import UploadFileIcon from "@/components/ui/icons/UploadFileIcon";
import CategoriesProvider from "@/core/api/Providers/CategoriesProvider";
import { useTranslation } from "react-i18next";

interface AddCategoryModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function AddCategoryModal({
    isOpen,
    onOpenChange,
    onSuccess,
}: AddCategoryModalProps) {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [categoryName, setCategoryName] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        if (file) {
            formData.append("image", file);
        }
        formData.append("name", categoryName);

        await CategoriesProvider.createCategory(formData)
            .then(() => {
                onOpenChange(false);
                if (onSuccess) {
                    onSuccess();
                    addToast({
                        title: t("categories.inputs.success"),
                        color: "success",
                        timeout: 2500,
                        shouldShowTimeoutProgress: true,
                    });
                }
            })
            .catch((error) => {
                console.error("Error creating category:", error);
                addToast({
                    title: t("categories.inputs.error"),
                    color: "danger",
                    hideIcon: true,
                    timeout: 2500,
                    shouldShowTimeoutProgress: true,
                });
            });
    };

    const renderCustomFileInput = () => (
        <div className="flex flex-row items-center gap-4">
            <div
                className="w-[100px] h-[100px] bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:bg-light-800 transition-colors duration-200"
                onClick={() => fileInputRef.current?.click()}
            >
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Preview"
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
                    {t("categories.inputs.image")}
                </label>
                <p className="text-xs text-gray-500">
                    {t("generics.image_format")}
                </p>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {t("categories.inputs.title")}
                        </ModalHeader>
                        <ModalBody>
                            <Form
                                id="add-category-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="mb-4">
                                    {renderCustomFileInput()}
                                </div>
                                <div className="mb-4">
                                    <Input
                                        label="Nom de la catégorie"
                                        placeholder={t(
                                            "categories.inputs.placeholder",
                                        )}
                                        required
                                        value={categoryName}
                                        onChange={(e) =>
                                            setCategoryName(e.target.value)
                                        }
                                    />
                                </div>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                {t("generics.cancel")}
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                form="add-category-form"
                            >
                                {t("generics.add")}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
