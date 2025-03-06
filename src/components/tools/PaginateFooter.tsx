import { Pagination, Select, SelectItem, SharedSelection } from "@heroui/react";
import { useEffect, useState } from "react";

interface PaginateFooterProps {
    totalPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
    onLimitChange: (limit: number) => void;
}

export default function PaginateFooter({
    totalPages,
    currentPage,
    handlePageChange,
    itemsPerPage,
    totalItems,
    onLimitChange,
}: PaginateFooterProps) {
    const [selectedLimit, setSelectedLimit] = useState(itemsPerPage.toString());

    useEffect(() => {
        setSelectedLimit(itemsPerPage.toString());
    }, [itemsPerPage]);

    const handleSelectChange = (selection: SharedSelection) => {
        let selectedKey: string;
        if (typeof selection === "string") {
            selectedKey = selection;
        } else if (selection instanceof Set) {
            const firstKey = Array.from(selection)[0];
            selectedKey =
                typeof firstKey === "string" ? firstKey : firstKey.toString();
        } else {
            console.error("Unexpected selection type", selection);
            return;
        }
        setSelectedLimit(selectedKey);
        if (selectedKey === "all") {
            onLimitChange(totalItems);
        } else {
            const numericValue = parseInt(selectedKey, 10);
            if (!isNaN(numericValue)) {
                onLimitChange(numericValue);
            } else {
                console.error("Valeur invalide :", selectedKey);
            }
        }
    };

    return (
        <div className="flex w-full justify-between items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
            />
            <div className="flex w-40 items-center gap-4">
                <Select
                    aria-label="items-per-page"
                    size="md"
                    selectedKeys={[selectedLimit]}
                    onSelectionChange={handleSelectChange}
                >
                    <SelectItem key="10" value="10">
                        10
                    </SelectItem>
                    <SelectItem key="50" value="50">
                        50
                    </SelectItem>
                    <SelectItem key="100" value="100">
                        100
                    </SelectItem>
                    <SelectItem key={totalItems.toString()} value="all">
                        Tous
                    </SelectItem>
                </Select>
                <span className="text-sm whitespace-nowrap">
                    {itemsPerPage > totalItems ? totalItems : itemsPerPage} sur{" "}
                    {totalItems}
                </span>
            </div>
        </div>
    );
}
