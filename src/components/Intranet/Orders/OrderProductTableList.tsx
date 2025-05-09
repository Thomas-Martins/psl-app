import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import { Product } from "@/types/Products.ts";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import { useTranslation } from "react-i18next";

interface OrderProductTableListProps {
    products: Product[];
}

export default function OrderProductTableList({
    products,
}: OrderProductTableListProps) {
    const { t } = useTranslation();
    return (
        <>
            <Table removeWrapper={true}>
                <TableHeader>
                    <TableColumn>
                        {t("orders.details.products.headers.product")}
                    </TableColumn>
                    <TableColumn>
                        {" "}
                        {t("orders.details.products.headers.quantity")}
                    </TableColumn>
                    <TableColumn>
                        {" "}
                        {t("orders.details.products.headers.price")}
                    </TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No rows to display."}>
                    {products.map((product: Product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <div className="flex gap-2">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-md"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-zinc-500 bg-opacity-20 rounded-md flex justify-center items-center">
                                            <ImageIcon size={18} />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <span className="text-sm font-semibold">
                                            {product.name}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500">
                                                {product.category.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {t(
                                                    "orders.details.products.ref",
                                                ) +
                                                    " : " +
                                                    product.reference}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {t(
                                                    "orders.details.products.location",
                                                ) +
                                                    " : " +
                                                    product.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{product.price} €</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
