import { useNavigate, useParams } from "react-router";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import { useEffect, useState } from "react";
import { Order } from "@/types/Orders";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import {
    addToast,
    Button,
    CircularProgress,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import StatusStep from "@components/Shop/Cart/StatusStep.tsx";
import FileIcon from "@components/ui/icons/FileIcon.tsx";
import ImageIcon from "@components/ui/icons/ImageIcon.tsx";
import { useTranslation } from "react-i18next";
import ArrowLeftIcon from "@components/ui/icons/ArrowLeftIcon.tsx";
import { saveAs } from "file-saver";
import i18n from "@core/i18n/i18n.ts";

export default function OrderDetail() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();
    const user = useSelector((state: RootState) => state.user);
    const [order, setOrder] = useState<Order>({} as Order);
    const [loading, setLoading] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

    const handleDownloadInvoice = async () => {
        if (!order.id) return;

        setDownloadingInvoice(true);
        try {
            const queryParams = {
                locale: i18n.resolvedLanguage || i18n.language,
            };
            const response = await OrdersProvider.downloadInvoice(
                order.id,
                queryParams,
                {},
            );
            const blob = new Blob([response.data], {
                type: "application/pdf",
            });
            saveAs(blob, `facture-${order.reference}.pdf`);
        } catch (e) {
            console.error(e);
            addToast({
                title: t("generics.errors.surprise"),
                color: "danger",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
                hideIcon: true,
            });
        } finally {
            setDownloadingInvoice(false);
        }
    };

    useEffect(() => {
        if (!orderId) {
            navigate("/orders");
            return;
        }
        setLoading(true);
        OrdersProvider.getOrder(orderId)
            .then((response) => {
                setOrder(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                navigate("/orders");
                setLoading(false);
            });
    }, [navigate, orderId]);

    return (
        <div className="bg-white p-3 md:p-5 rounded-2xl shadow-md space-y-8 md:space-y-20">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            ) : (
                <div className="space-y-6 md:space-y-8">
                    <div className="space-y-4 md:space-y-5">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="light"
                                    isIconOnly={true}
                                    onPress={() => navigate(-1)}
                                    size="sm"
                                >
                                    <ArrowLeftIcon size={20} />
                                </Button>
                                <h3 className="text-lg md:text-xl font-medium">
                                    {t("orders.title", {
                                        reference: order?.reference,
                                    })}
                                </h3>
                            </div>
                            <Button
                                variant="light"
                                size="sm"
                                className="self-start md:self-center"
                                onPress={handleDownloadInvoice}
                                isLoading={downloadingInvoice}
                                isDisabled={!order.id}
                            >
                                <span className="text-xs md:text-sm">
                                    {t("orders.download.title")}
                                </span>
                                <FileIcon />
                            </Button>
                        </div>
                        <Divider />
                        <h3 className="text-sm font-medium">
                            {t("orders.details.delivery.title")}
                        </h3>
                        <div className="px-3 md:px-5 space-y-2 text-xs md:text-sm">
                            {user.store ? (
                                <>
                                    <p className="font-medium">
                                        {user.store.name}
                                    </p>
                                    <p>
                                        {user.store.address},{" "}
                                        {user.store.zipcode} {user.store.city}
                                    </p>
                                    <p>{user.store.phone}</p>
                                </>
                            ) : (
                                <p>{t("orders.details.delivery.no_store")}</p>
                            )}
                        </div>
                    </div>
                    {order.status ? (
                        <div className="py-4">
                            <StatusStep status={order.status} />
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <CircularProgress />
                        </div>
                    )}
                    <div className="space-y-4 md:space-y-5">
                        <h3 className="text-sm font-semibold">
                            {t("orders.details.title")} :
                        </h3>
                        <div className="space-y-2 text-xs md:text-sm">
                            <div className="hidden md:block">
                                <Table removeWrapper>
                                    <TableHeader>
                                        <TableColumn>
                                            {t(
                                                "orders.details.products.headers.product",
                                            )}
                                        </TableColumn>
                                        <TableColumn>
                                            {t(
                                                "orders.details.products.headers.quantity",
                                            )}
                                        </TableColumn>
                                        <TableColumn>
                                            {t(
                                                "orders.details.products.headers.price",
                                            )}
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {order?.products?.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-5">
                                                        {product.image_url ? (
                                                            <img
                                                                src={
                                                                    product.image_url
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="w-12 h-12 rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="bg-zinc-500 bg-opacity-20 w-12 h-12 rounded-lg flex justify-center items-center">
                                                                <ImageIcon
                                                                    size={30}
                                                                    color={
                                                                        "white"
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                        <p>{product.name}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{product.quantity}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>€{product.price}</p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Mobile view */}
                            <div className="md:hidden space-y-3">
                                {order?.products?.map((product) => (
                                    <div key={product.id} className="p-3">
                                        <div className="flex items-start gap-3">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-16 h-16 rounded-lg flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="bg-zinc-500 bg-opacity-20 w-16 h-16 rounded-lg flex justify-center items-center flex-shrink-0">
                                                    <ImageIcon
                                                        size={24}
                                                        color={"white"}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm leading-tight mb-2">
                                                    {product.name}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">
                                                        {t(
                                                            "orders.details.products.headers.quantity",
                                                        )}
                                                        : {product.quantity}
                                                    </span>
                                                    <span className="font-medium text-sm">
                                                        €{product.price}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
