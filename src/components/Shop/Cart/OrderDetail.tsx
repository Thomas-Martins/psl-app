import { useNavigate, useParams } from "react-router";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import { useEffect, useState } from "react";
import { Order } from "@/types/Orders";
import { useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import {
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

export default function OrderDetail() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();
    const user = useSelector((state: RootState) => state.user);
    const [order, setOrder] = useState<Order>({} as Order);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!orderId) {
            navigate("/orders");
            return;
        }
        setLoading(true);
        OrdersProvider.getOrder(Number(orderId))
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
        <div className="bg-white p-5 rounded-2xl shadow-md space-y-20">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="light"
                                    isIconOnly={true}
                                    onPress={() => navigate(-1)}
                                >
                                    <ArrowLeftIcon size={20} />
                                </Button>
                                <h3 className="text-xl font-medium">
                                    {t("orders.title", {
                                        reference: order?.reference,
                                    })}
                                </h3>
                            </div>
                            <Button variant="light">
                                {t("orders.download.title")}
                                <FileIcon />
                            </Button>
                        </div>
                        <Divider />
                        <h3 className="text-sm">
                            {t("orders.details.delivery.title")}
                        </h3>
                        <div className="px-5 space-y-2 text-sm">
                            {user.store ? (
                                <>
                                    <p>{user.store.name}</p>
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
                        <StatusStep status={order.status} />
                    ) : (
                        <CircularProgress />
                    )}
                    <div className="space-y-5">
                        <h3 className="text-sm font-semibold">
                            {t("orders.details.title")} :
                        </h3>
                        <div className="space-y-2 text-sm">
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
                                                            alt={product.name}
                                                            className="w-12 h-12 rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="bg-light-200 w-12 h-12 rounded-lg flex justify-center items-center">
                                                            <ImageIcon
                                                                size={30}
                                                                color={"white"}
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
                    </div>
                </div>
            )}
        </div>
    );
}
