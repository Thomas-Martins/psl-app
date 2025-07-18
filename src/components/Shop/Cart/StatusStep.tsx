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
            "p-2 md:p-5 rounded-full shadow w-12 h-12 md:w-24 md:h-24 flex justify-center items-center",
            currentStep >= stepNumber && "bg-green-500",
        );

    return (
        <div className="grid grid-cols-5 items-center gap-0 px-1 md:px-32">
            <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className={circleClass(1)}>
                    <CartCheckIcon
                        size={20}
                        className="md:w-[50px] md:h-[50px]"
                        color="black"
                    />
                </div>
                <p className="text-[10px] md:text-sm text-center leading-tight md:text-nowrap">
                    {t("orders.status.pending")}
                </p>
            </div>

            <div className="flex justify-center">
                <Divider className="w-full" />
            </div>

            <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className={circleClass(2)}>
                    <PackageIcon
                        size={20}
                        className="md:w-[50px] md:h-[50px]"
                        color="black"
                    />
                </div>
                <p className="text-[10px] md:text-sm text-center leading-tight md:text-nowrap">
                    {t("orders.status.processing")}
                </p>
            </div>

            <div className="flex justify-center">
                <Divider className="w-full" />
            </div>

            <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className={circleClass(3)}>
                    <DoubleCheckIcon
                        size={20}
                        className="md:w-[50px] md:h-[50px]"
                        color="black"
                    />
                </div>
                <p className="text-[10px] md:text-sm text-center leading-tight md:text-nowrap">
                    {t("orders.status.shipped")}
                </p>
            </div>
        </div>
    );
}
