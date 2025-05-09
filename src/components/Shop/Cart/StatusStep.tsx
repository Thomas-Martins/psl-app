import { OrderStatus } from "@/types/OrderStatus.ts";
import CartCheckIcon from "@components/ui/icons/CartCheckIcon.tsx";
import PackageIcon from "@components/ui/icons/PackageIcon.tsx";
import DoubleCheckIcon from "@components/ui/icons/DoubleCheckIcon.tsx";
import { Divider } from "@heroui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface StatusStepProps {
    status: OrderStatus;
}

export default function StatusStep({ status }: StatusStepProps) {
    const { t } = useTranslation();
    const currentStep =
        status === OrderStatus.PENDING
            ? 1
            : status === OrderStatus.PROCESSING ||
                status === OrderStatus.COMPLETED
              ? 2
              : status === OrderStatus.SHIPPED
                ? 3
                : 0;

    const circleClass = (stepNumber: number) =>
        clsx(
            "p-5 rounded-full shadow w-24 h-24 flex justify-center items-center",
            currentStep >= stepNumber && "bg-green-500",
        );

    return (
        <div className="flex justify-between items-center px-32 gap-2">
            <div className="flex flex-col items-center gap-2">
                <div className={circleClass(1)}>
                    <CartCheckIcon size={50} color="black" />
                </div>
                <p className="text-xs text-nowrap">
                    {t("orders.status.pending")}
                </p>
            </div>

            <div className="w-full">
                <Divider />
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className={circleClass(2)}>
                    <PackageIcon size={50} color="black" />
                </div>
                <p className="text-xs text-nowrap">
                    {" "}
                    {t("orders.status.processing")}
                </p>
            </div>

            <div className="w-full">
                <Divider />
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className={circleClass(3)}>
                    <DoubleCheckIcon size={50} color="black" />
                </div>
                <p className="text-xs text-nowrap">
                    {" "}
                    {t("orders.status.shipped")}
                </p>
            </div>
        </div>
    );
}
