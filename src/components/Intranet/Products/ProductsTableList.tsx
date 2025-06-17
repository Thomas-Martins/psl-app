import { PaginatedProducts, Product } from "@/types/Products.ts";
import { useTranslation } from "react-i18next";
import { ProductsTableListHeaders } from "@components/Intranet/Products/ProductsTableList.headers.ts";
import { Key, useState } from "react";
import type { SortDescriptor as TableSortDescriptor } from "@react-types/shared/src/collections";
import ProductsProvider from "@core/api/Providers/ProductsProvider.ts";
import {
    addToast,
    CircularProgress,
    Image,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu.tsx";
import { Action } from "@utils/Action.ts";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import { useNavigate } from "react-router";
import ProductAddStockModal from "@components/Intranet/Products/ProductAddStockModal.tsx";

interface ProductsTableListProps {
    products: PaginatedProducts;
    onSortChange: (newOrderBy: string, newOrderWay: "ASC" | "DESC") => void;
    orderBy: string;
    orderWay: "ASC" | "DESC";
    isLoading: boolean;
    mutate: () => Promise<PaginatedProducts | undefined>;
}

export default function ProductsTableList({
    products,
    onSortChange,
    orderBy,
    orderWay,
    isLoading,
    mutate,
}: ProductsTableListProps) {
    const { t } = useTranslation();
    const headers = ProductsTableListHeaders(t);
    const navigate = useNavigate();
    const { isOpen, onOpenChange } = useDisclosure();

    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        null,
    );

    const [sortDescriptor, setSortDescriptor] = useState<TableSortDescriptor>({
        column: orderBy,
        direction: orderWay === "ASC" ? "ascending" : "descending",
    });

    const handleSortChange = (descriptor: TableSortDescriptor) => {
        let newDirection: "ascending" | "descending" = "ascending";
        if (sortDescriptor && sortDescriptor.column === descriptor.column) {
            newDirection =
                sortDescriptor.direction === "ascending"
                    ? "descending"
                    : "ascending";
        }
        const newDescriptor: TableSortDescriptor = {
            column: descriptor.column,
            direction: newDirection,
        };
        setSortDescriptor(newDescriptor);

        const newOrderBy =
            typeof newDescriptor.column === "string"
                ? newDescriptor.column
                : String(newDescriptor.column);
        const newOrderWay = newDirection === "ascending" ? "ASC" : "DESC";
        onSortChange(newOrderBy, newOrderWay);
    };

    const handleDeleteProduct = async (product: Product) => {
        try {
            await ProductsProvider.deleteProduct(product.id);
            await mutate();
            addToast({
                color: "success",
                title: t("products.table.actions.delete.success"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        } catch (error) {
            console.error(error);
            addToast({
                color: "danger",
                title: t("products.table.actions.delete.error"),
                shouldShowTimeoutProgress: true,
                timeout: 5000,
            });
        }
    };

    const handleRowAction = (key: Key) => {
        navigate(`/stocks/${key}`);
    };

    const loadingState =
        isLoading || products.data.length === 0 ? "loading" : "idle";

    const handleOpenAddStockModal = (productId: string) => {
        setSelectedProductId(productId);
        onOpenChange();
    };

    return (
        <div>
            <Table
                removeWrapper
                aria-label="products-table-list"
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
                onRowAction={handleRowAction}
            >
                <TableHeader>
                    {headers.map((header) => (
                        <TableColumn
                            key={header.key}
                            allowsSorting={header.sortable}
                        >
                            {header.label}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody
                    items={products.data}
                    loadingContent={
                        <CircularProgress
                            aria-label="loader"
                            className="stroke-primary-500"
                        />
                    }
                    loadingState={loadingState}
                >
                    {products.data.map((product) => (
                        <TableRow
                            key={product.id}
                            className="hover:bg-zinc-500 hover:bg-opacity-10 cursor-pointer"
                        >
                            <TableCell width="60%">
                                <div className={"flex gap-4"}>
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            width={80}
                                            height={80}
                                            className={"object-cover"}
                                        />
                                    ) : (
                                        <div
                                            className={
                                                "bg-zinc-500 bg-opacity-20 min-h-20 min-w-20 rounded-lg flex justify-center items-center"
                                            }
                                        >
                                            <ImageIcon
                                                color={"white"}
                                                size={30}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-md">
                                            {product.name}
                                            {" - "}
                                            <span>{product.category.name}</span>
                                        </h3>
                                        <p className="text-sm text-light-400">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">{product.reference}</h3>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">{product.location}</h3>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">{product.stock}</h3>
                            </TableCell>
                            <TableCell>
                                <h3 className="text-md">{product.price} €</h3>
                            </TableCell>
                            <TableCell>
                                <ThreeDotMenu
                                    actions={[
                                        {
                                            label: t(
                                                "products.table.actions.edit",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                navigate(
                                                    `/stocks/${product.id}/edit`,
                                                ),
                                        },
                                        {
                                            label: t(
                                                "products.table.actions.add_stocks",
                                            ),
                                            variant: "default",
                                            onClick: () =>
                                                handleOpenAddStockModal(
                                                    product.id,
                                                ),
                                        },
                                        {
                                            label: t(
                                                "products.table.actions.delete.title",
                                            ),
                                            variant: "danger",
                                            onClick: Action.create(async () => {
                                                await handleDeleteProduct(
                                                    product,
                                                );
                                            })
                                                .confirm(
                                                    t(
                                                        "products.table.actions.delete.dialog.title",
                                                    ),
                                                    t(
                                                        "products.table.actions.delete.dialog.message",
                                                        {
                                                            name: product.name,
                                                        },
                                                    ),
                                                    "danger",
                                                    t(
                                                        "products.table.actions.delete.dialog.confirm",
                                                    ),
                                                    t("generics.cancel"),
                                                )
                                                .build(),
                                        },
                                    ]}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <ProductAddStockModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                productId={selectedProductId}
                onSuccess={async () => {
                    await mutate();
                    onOpenChange();
                }}
            />
        </div>
    );
}
