import { PaginatedOrders } from "@/types/Orders.ts";
import useSWR from "swr";
import { useSort } from "@utils/hook/useSort.ts";
import { usePagination } from "@utils/hook/usePagination.ts";
import OrdersTableList from "@components/Intranet/Orders/OrdersTableList.tsx";
import PaginateFooter from "@components/tools/PaginateFooter.tsx";
import OrdersProvider from "@core/api/Providers/OrdersProvider.ts";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { Select, SelectItem } from "@heroui/react";
import { orderStatusName } from "@utils/utils.ts";
import SearchInput from "@components/tools/SearchInput.tsx";
import { useState } from "react";
import OrdersAccordionListMobile from "@components/Intranet/Orders/OrdersAccordionListMobile";
import { useMediaQuery } from "@utils/hook/useMediaQuery";

const fetchOrders = async (key: string): Promise<PaginatedOrders> => {
    const params = JSON.parse(key);

    const response = await OrdersProvider.getOrders({
        paginate: true,
        page: params.page,
        limit: params.limit,
        orderBy: params.orderBy,
        orderWay: params.orderWay,
        search: params.search,
        status: params.status !== "all" ? params.status : undefined,
    });
    return response.data;
};

export default function OrdersPage() {
    const { t } = useTranslation();
    const { orderBy, orderWay, handleSortChange } = useSort("reference", "ASC");
    const { currentPage, limit, handlePageChange, handleLimitChange } =
        usePagination(1, 10);

    const [search, setSearch] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    const swrKey = JSON.stringify({
        key: "orders",
        page: currentPage,
        limit,
        orderBy,
        orderWay,
        search,
        status: selectedStatus,
    });

    const { data, error, isLoading, mutate } = useSWR<PaginatedOrders>(
        swrKey,
        fetchOrders,
        {
            keepPreviousData: true,
        },
    );

    const orders: PaginatedOrders = data ?? {
        current_page: currentPage,
        data: [],
        per_page: limit,
        total: 0,
        last_page: 1,
    };

    const orderStatus = data?.status ?? [];

    const isMobile = useMediaQuery("(max-width: 768px)");

    const handleStatusChange = (statusValue: string) => {
        setSelectedStatus(statusValue);
        handlePageChange(1);
    };

    if (error) {
        return <div>{t("errors.message")}</div>;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-5 w-full">
                <Select
                    aria-label="order-status-filter"
                    className="w-full md:w-1/4"
                    radius="md"
                    defaultSelectedKeys={["all"]}
                    onChange={(e) => handleStatusChange(e.target.value)}
                >
                    {[
                        <SelectItem key="all">
                            {t("orders.status.all")}
                        </SelectItem>,
                        ...orderStatus.map((status) => (
                            <SelectItem key={status}>
                                {orderStatusName(status)}
                            </SelectItem>
                        )),
                    ]}
                </Select>
                <SearchInput
                    setSearch={setSearch}
                    classNames={"w-full md:w-1/4"}
                />
            </div>
            {isMobile ? (
                <OrdersAccordionListMobile
                    orders={orders}
                    isLoading={isLoading}
                    mutate={mutate}
                />
            ) : (
                <OrdersTableList
                    orders={orders}
                    isLoading={isLoading}
                    onSortChange={handleSortChange}
                    orderBy={orderBy}
                    orderWay={orderWay}
                    mutate={mutate}
                />
            )}
            {orders && orders.data && orders.data.length > 0 && (
                <PaginateFooter
                    values={["10", "50", "100"]}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    totalPages={orders?.last_page || 1}
                    totalItems={orders?.total || 0}
                    itemsPerPage={limit}
                    onLimitChange={(newLimit) =>
                        handleLimitChange(
                            newLimit,
                            orders ? Number(orders.total) : 10,
                        )
                    }
                />
            )}

            <Outlet />
        </div>
    );
}
