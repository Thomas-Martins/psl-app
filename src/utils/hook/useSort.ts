import { useState } from "react";

export type SortOrder = "ASC" | "DESC";

export function useSort(initialOrderBy: string, initialOrderWay: SortOrder) {
    const [orderBy, setOrderBy] = useState(initialOrderBy);
    const [orderWay, setOrderWay] = useState<SortOrder>(initialOrderWay);

    const handleSortChange = (newOrderBy: string, newOrderWay: SortOrder) => {
        setOrderBy(newOrderBy);
        setOrderWay(newOrderWay);
    };

    return { orderBy, orderWay, handleSortChange };
}
