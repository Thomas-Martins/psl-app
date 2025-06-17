import { 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalHeader, 
    ModalFooter,
    Button,
    Select,
    SelectItem
} from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OrderStatus } from "@/types/OrderStatus.ts";
import { orderStatusName } from "@utils/utils.ts";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import { addToast } from "@heroui/react";

interface OrderStatusModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    orderId: string;
    currentStatus: OrderStatus;
    orderReference: string;
    onStatusUpdated: () => void;
}

export default function OrderStatusModal({
    isOpen,
    onOpenChange,
    orderId,
    currentStatus,
    orderReference,
    onStatusUpdated
}: OrderStatusModalProps) {
    const { t } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusUpdate = async () => {
        if (selectedStatus === currentStatus) {
            onOpenChange();
            return;
        }

        setIsLoading(true);
        try {
            await OrdersProvider.updateOrder(orderId, {
                status: selectedStatus
            });
            
            addToast({
                title: t("orders.status.update.success"),
                description: t("orders.status.update.success_description", { 
                    reference: orderReference,
                    status: orderStatusName(selectedStatus)
                }),
                color: "success",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            
            onStatusUpdated();
            onOpenChange();
        } catch (error) {
            console.error("Error updating order status:", error);
            addToast({
                title: t("generics.errors.surprise"),
                color: "danger",
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedStatus(currentStatus);
        onOpenChange();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={handleClose}
            size="md"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    {t("orders.status.update.title")}
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-foreground-500 mb-2">
                                {t("orders.status.update.description", { reference: orderReference })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">
                                {t("orders.status.current")}:
                            </p>
                            <p className="text-sm text-foreground-600">
                                {orderStatusName(currentStatus)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">
                                {t("orders.status.new")}:
                            </p>
                            <Select
                                aria-label="Select new status"
                                selectedKeys={[selectedStatus]}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0] as OrderStatus;
                                    setSelectedStatus(selected);
                                }}
                                className="w-full"
                            >
                                {Object.values(OrderStatus).map((status) => (
                                    <SelectItem key={status}>
                                        {orderStatusName(status)}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button 
                        color="danger" 
                        variant="light" 
                        onPress={handleClose}
                        isDisabled={isLoading}
                    >
                        {t("generics.cancel")}
                    </Button>
                    <Button 
                        color="primary" 
                        onPress={handleStatusUpdate}
                        isLoading={isLoading}
                        isDisabled={selectedStatus === currentStatus}
                    >
                        {t("orders.status.update.button")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
