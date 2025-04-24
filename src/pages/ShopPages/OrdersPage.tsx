import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import { Accordion, AccordionItem, CircularProgress } from "@heroui/react";
import { Link } from "react-router";
import { Order } from "@/types/Order.ts";

export default function OrdersPage() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        setLoading(true);
        OrdersProvider.getOrders()
            .then((response) => {
                setOrders(response.data.data);
            })
            .catch()
            .finally(() => {
                setLoading(false);
            });
    }, [setLoading, setOrders]);

    const calculateTotalPriceTva = (ht: number): number => {
        const TVA_RATE = 0.2;
        const ttc = ht * (1 + TVA_RATE);
        return Math.round(ttc * 100) / 100;
    };

    return (
        <div className="bg-white px-3 py-5 rounded-2xl shadow">
            <h1 className="text-2xl font-bold mb-4 px-2">
                {t("orders.my_orders")}
            </h1>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <CircularProgress />
                </div>
            ) : (
                <div>
                    {orders.length > 0 ? (
                        <Accordion variant="splitted">
                            {orders.map((order) => (
                                <AccordionItem
                                    key={order.id}
                                    aria-label={order.reference}
                                    title={t("orders.title", {
                                        reference: order.reference,
                                    })}
                                >
                                    <div>
                                        {t("orders.details.products.count")} :{" "}
                                        {order.products.length}
                                    </div>
                                    <div>
                                        {t("orders.total_ht")} :{" "}
                                        {order.total_price.toFixed(2)} €
                                    </div>
                                    <div>
                                        {t("orders.total_ttc")} :{" "}
                                        {calculateTotalPriceTva(
                                            order.total_price,
                                        ).toFixed(2)}{" "}
                                        €
                                    </div>
                                    <div>
                                        <Link to={`/orders/${order.id}`}>
                                            <p className="text-light-400 underline hover:text-light-600">
                                                {t("orders.details.more")}
                                            </p>
                                        </Link>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div>
                            <p>{t("orders.empty")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
