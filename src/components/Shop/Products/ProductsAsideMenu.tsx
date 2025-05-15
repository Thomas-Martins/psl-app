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

export default function ProductsAsideMenu() {
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
    }, [filters, priceRange, selectedCategories, setFilters]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto min-h-0">
                <h1 className="mb-2 px-2">
                    {t("products.shop.filters._name")}
                </h1>
                <Divider />
                <Accordion isCompact>
                    <AccordionItem
                        aria-label={t("categories._name")}
                        title={t("categories._name")}
                        className="overflow-visible"
                    >
                        <div className="max-h-96 overflow-y-auto">
                            <CheckboxGroup
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                            >
                                {categories?.map((category) => (
                                    <Checkbox
                                        key={category.id}
                                        value={category.name}
                                    >
                                        <p>
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
                <Divider />
                <Slider
                    classNames={{
                        base: "p-2",
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

            <div className="shrink-0 pt-4">
                <Button className="w-full" onPress={handleApplyFilters}>
                    {t("products.shop.filters.button")}
                </Button>
            </div>
        </div>
    );
}
