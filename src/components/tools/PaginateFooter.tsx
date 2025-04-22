import { Pagination, Select, SelectItem, SharedSelection } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PaginateFooterProps {
    values: string[];
    totalPages: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
    onLimitChange: (limit: number) => void;
}

export default function PaginateFooter({
    values,
    totalPages,
    currentPage,
    handlePageChange,
    itemsPerPage,
    totalItems,
    onLimitChange,
}: PaginateFooterProps) {
    const { t } = useTranslation();
    const initialSelection =
        totalItems <= 10 || itemsPerPage === totalItems
            ? "all"
            : itemsPerPage.toString();

    const [selectedLimit, setSelectedLimit] = useState(initialSelection);
    const [userSelected, setUserSelected] = useState(false);

    useEffect(() => {
        if (!userSelected) {
            const newSelection =
                totalItems <= 10 || itemsPerPage === totalItems
                    ? "all"
                    : itemsPerPage.toString();
            if (newSelection !== selectedLimit) {
                setSelectedLimit(newSelection);
            }
        }
    }, [itemsPerPage, totalItems, userSelected, selectedLimit]);

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
        setUserSelected(true);
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
                    <>
                        {values.map((value) => (
                            <SelectItem key={value} data-value={value}>
                                {value}
                            </SelectItem>
                        ))}
                        <SelectItem key="all" data-value="all">
                            {t("generics.all")}
                        </SelectItem>
                    </>
                </Select>
                <span className="text-sm whitespace-nowrap">
                    {itemsPerPage > totalItems ? totalItems : itemsPerPage} sur{" "}
                    {totalItems}
                </span>
            </div>
        </div>
    );
}
