// usePagination.ts
import { useState } from "react";

export function usePagination(
    initialPage: number = 1,
    initialLimit: number = 10,
) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    /**
     * newLimit peut être un nombre ou "all".
     * totalItems est nécessaire pour calculer la limite effective lorsque newLimit est "all".
     */
    const handleLimitChange = (
        newLimit: number | "all",
        totalItems: number,
    ) => {
        const effectiveLimit = newLimit === "all" ? totalItems : newLimit;
        setLimit(effectiveLimit);
        setCurrentPage(1);
    };

    return { currentPage, limit, handlePageChange, handleLimitChange };
}
