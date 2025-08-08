import {
    addToast,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    NumberInput,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import { validators } from "@utils/InputForm.validators.ts";
import { useTranslation } from "react-i18next";
import CategoriesProvider from "@core/api/Providers/CategoriesProvider.ts";
import SuppliersProvider from "@core/api/Providers/SuppliersProvider.ts";
import { Category } from "@/types/Categories.ts";
import { Supplier } from "@/types/Suppliers.ts";
import UploadFileIcon from "@components/ui/icons/UploadFileIcon.tsx";
import { useProducts } from "@/contexts/Products/ProductsContext";

interface ProductEditModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}
export default function ProductEditModal({
    isOpen,
    onOpenChange,
}: ProductEditModalProps) {
    const { productId } = useParams<{ productId: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate } = useProducts();
    const effectiveOpen = Boolean(productId) || isOpen;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        reference: "",
        location: "",
        category_id: "0",
        supplier_id: "",
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [previewImage, setPreviewImage] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClose = useCallback(() => {
        onOpenChange(false);
        navigate("/stocks");
    }, [onOpenChange, navigate]);

    const fetchProduct = useCallback(async () => {
        try {
            if (!productId) {
                addToast({
                    title: t("generics.errors.surprise"),
                    color: "danger",
                    timeout: 2000,
                    shouldShowTimeoutProgress: true,
                    hideIcon: true,
                });
                return;
            }
            const response = await ProductsProvider.getProduct(productId);
            if (response?.data) {
                setFormData({
                    name: response.data.data.name,
                    description: response.data.data.description,
                    price: response.data.data.price,
                    stock: response.data.data.stock,
                    reference: response.data.data.reference,
                    location: response.data.data.location,
                    category_id: String(response.data.data.category.id),
                    supplier_id: String(response.data.data.supplier.id),
                });
                setPreviewImage(response.data.data.image_url || "");
            }
        } catch (e) {
            console.error(e);
            addToast({
                title: t("generics.errors.surprise"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
            handleClose();
        }
    }, [handleClose, productId, t]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await CategoriesProvider.getCategories();
            if (response?.data) {
                setCategories(response.data);
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    const fetchSuppliers = useCallback(async () => {
        try {
            const response = await SuppliersProvider.getSuppliers({
                paginate: true,
                limit: -1,
                orderBy: "name",
                orderWay: "ASC",
            });
            if (response?.data) {
                setSuppliers(response.data.data);
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        fetchProduct().then();
        fetchCategories().then();
        fetchSuppliers().then();
    }, [fetchProduct, fetchCategories, fetchSuppliers]);

    const fieldValidatorMapping: Record<string, string> = {
        name: "Name",
        description: "Description",
        price: "Price",
        stock: "Stock",
        reference: "Reference",
        location: "Location",
    };

    const handleChange = (
        field: keyof typeof formData,
        value: string | number,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        const validatorKey = fieldValidatorMapping[field];
        if (validatorKey && validators[validatorKey]) {
            const error = validators[validatorKey](String(value));
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
                const value = String(formData[field as keyof typeof formData]);
                const error = validators[validatorKey](value);
                if (error) {
                    newErrors[field] = error;
                }
            }
        });
        setErrors(newErrors);
        return newErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setIsSubmitting(false);
            return;
        }
        try {
            if (!productId) return;
            await ProductsProvider.updateProduct(productId, formData);
            addToast({
                title: t("products.edit.alert.success"),
                color: "success",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
            await mutate();
            navigate("/stocks");
        } catch (error) {
            console.error("Error updating product:", error);
            addToast({
                title: t("products.edit.alert.error"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNumberChange = (field: "price" | "stock", value: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        const validatorKey = fieldValidatorMapping[field];
        if (validatorKey && validators[validatorKey]) {
            const error = validators[validatorKey](String(value));
            setErrors((prev) => ({
                ...prev,
                [field]: error || "",
            }));
        }
    };

    const uploadProductImage = async (file: File) => {
        if (!productId) {
            throw new Error("Product ID is not defined");
        }
        const formData = new FormData();
        formData.append("image", file);
        const res = await ProductsProvider.uploadProductImage(
            productId,
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
                title: t("products.edit.alert.image.size"),
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
            const { image_url } = await uploadProductImage(file);
            setPreviewImage(image_url);
            addToast({
                title: t("products.edit.alert.image.success"),
                color: "success",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });
        } catch (err) {
            console.error(err);
            addToast({
                title: t("products.add.inputs.image.error"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        }
    };

    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    return (
        <Modal
            isOpen={effectiveOpen}
            onOpenChange={(open) => {
                if (!open) handleClose();
            }}
            size="xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{t("products.edit.title")}</ModalHeader>
                        <ModalBody className="max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div
                                        className="w-36 h-32 bg-black dark:bg-neutral-400 rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:bg-light-800 transition-colors"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        {previewImage ? (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                                    <UploadFileIcon
                                                        color="white"
                                                        size={40}
                                                    />
                                                </div>
                                                <img
                                                    src={previewImage}
                                                    alt={t(
                                                        "products.add.inputs.image.alt",
                                                    )}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
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
                                            {t(
                                                "products.add.inputs.image.title",
                                            )}
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            {t(
                                                "products.add.inputs.image.format",
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Input
                                label={t("products.add.inputs.name")}
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                                errorMessage={errors.name}
                                isInvalid={!!errors.name}
                            />
                            <div className="flex flex-col md:flex-row gap-4">
                                <Input
                                    label={t("products.add.inputs.reference")}
                                    value={formData.reference}
                                    onChange={(e) =>
                                        handleChange(
                                            "reference",
                                            e.target.value,
                                        )
                                    }
                                    errorMessage={errors.reference}
                                    isInvalid={!!errors.reference}
                                />
                                <Input
                                    label={t("products.add.inputs.location")}
                                    value={formData.location}
                                    onChange={(e) =>
                                        handleChange("location", e.target.value)
                                    }
                                    errorMessage={errors.location}
                                    isInvalid={!!errors.location}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <NumberInput
                                    label={t("products.add.inputs.price")}
                                    value={formData.price}
                                    onChange={(value) => {
                                        if (typeof value === "number") {
                                            handleNumberChange("price", value);
                                        }
                                    }}
                                    errorMessage={errors.price}
                                    isInvalid={!!errors.price}
                                />

                                <NumberInput
                                    label={t("products.add.inputs.stock")}
                                    value={formData.stock}
                                    onChange={(value) => {
                                        if (typeof value === "number") {
                                            handleNumberChange("stock", value);
                                        }
                                    }}
                                    errorMessage={errors.stock}
                                    isInvalid={!!errors.stock}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select
                                    label="Catégorie"
                                    selectedKeys={[
                                        String(formData.category_id),
                                    ]}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            category_id: e.target.value,
                                        }));
                                    }}
                                >
                                    {categories.map((category: Category) => (
                                        <SelectItem key={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Fournisseur"
                                    selectedKeys={[
                                        String(formData.supplier_id),
                                    ]}
                                    onChange={(e) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            supplier_id: e.target.value,
                                        }));
                                    }}
                                >
                                    {suppliers.map((supplier: Supplier) => (
                                        <SelectItem key={supplier.id}>
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <Textarea
                                label={t("products.add.inputs.description")}
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                errorMessage={errors.description}
                                isInvalid={!!errors.description}
                            />
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
