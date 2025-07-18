import { useProductFilters } from "@/contexts/Products/ProductFiltersContext.ts";
import {
    Accordion,
    AccordionItem,
    Button,
    Checkbox,
    CheckboxGroup,
    Divider,
    Slider,
} from "@heroui/react";
import CategoriesProvider from "@core/api/Providers/CategoriesProvider.ts";
import { useCallback, useEffect, useState } from "react";
import { Category } from "@/types/Categories.ts";
import { useTranslation } from "react-i18next";

interface MobileFiltersDrawerProps {
    onClose: () => void;
}

export default function MobileFiltersDrawer({
    onClose,
}: MobileFiltersDrawerProps) {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const { filters, setFilters } = useProductFilters();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

    const fetchCategories = useCallback(async () => {
        const response = await CategoriesProvider.getCategories({
            paginate: false,
            products_count: true,
        });
        return response.data;
    }, []);

    useEffect(() => {
        fetchCategories().then((res) => {
            setCategories(res);
        });
    }, [fetchCategories]);

    const handleApplyFilters = useCallback(() => {
        setFilters({
            ...filters,
            categories: selectedCategories,
            priceRange: priceRange,
        });
        onClose(); // Fermer le drawer après avoir appliqué les filtres
    }, [filters, priceRange, selectedCategories, setFilters, onClose]);

    return (
        <div className="flex flex-col h-full">
            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                <Accordion isCompact>
                    <AccordionItem
                        aria-label={t("categories._name")}
                        title={t("categories._name")}
                        className="overflow-visible"
                    >
                        <div className="max-h-80 overflow-y-auto">
                            <CheckboxGroup
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                            >
                                {categories?.map((category) => (
                                    <Checkbox
                                        key={category.id}
                                        value={category.name}
                                    >
                                        <p className="text-sm break-words">
                                            {category.name}{" "}
                                            <span className="text-xs text-light-300">
                                                ({category.products_count})
                                            </span>
                                        </p>
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </div>
                    </AccordionItem>
                </Accordion>
                <Divider className="my-4" />
                <Slider
                    classNames={{
                        base: "px-2 pb-4",
                        labelWrapper: "mb-2",
                        label: "font-medium text-default-700 text-medium",
                        value: "text-light-400 text-small",
                    }}
                    defaultValue={[0, 1000]}
                    disableThumbScale={true}
                    formatOptions={{ style: "currency", currency: "EUR" }}
                    label={t("products.shop.price")}
                    maxValue={1000}
                    minValue={0}
                    showOutline={true}
                    showSteps={true}
                    showTooltip={true}
                    step={100}
                    tooltipProps={{
                        offset: 5,
                        placement: "bottom",
                    }}
                    tooltipValueFormatOptions={{
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                    }}
                    size="sm"
                    onChange={(value) => setPriceRange(value as number[])}
                />
            </div>

            <div className="shrink-0 p-4">
                <Button className="w-full" onPress={handleApplyFilters}>
                    {t("products.shop.filters.button")}
                </Button>
            </div>
        </div>
    );
}
