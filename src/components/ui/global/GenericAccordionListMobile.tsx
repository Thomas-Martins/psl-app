import { ReactNode, useState } from "react";
import {
    Accordion,
    AccordionItem,
    CircularProgress,
    Button,
} from "@heroui/react";
import ThreeDotMenu from "@components/tools/ThreeDotMenu";

export type AccordionActionVariant =
    | "default"
    | "danger"
    | "success"
    | "warning"
    | "primary"
    | "secondary";

export interface AccordionAction {
    label: string;
    variant: AccordionActionVariant;
    onClick: () => void;
}

interface GenericAccordionListMobileProps<T> {
    items: T[];
    isLoading: boolean;
    getHeaderContent: (item: T) => ReactNode;
    getBodyContent: (item: T) => ReactNode;
    getActions: (
        item: T,
        setLoadingId: (id: string) => void,
        loadingId: string | null,
    ) => AccordionAction[];
    getKey: (item: T) => string;
    showViewButton?: boolean;
    onView?: (item: T) => void;
}

export default function GenericAccordionListMobile<T>({
    items,
    isLoading,
    getHeaderContent,
    getBodyContent,
    getActions,
    getKey,
    showViewButton = false,
    onView,
}: GenericAccordionListMobileProps<T>) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <CircularProgress
                    aria-label="loader"
                    className="stroke-primary-500"
                />
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">Aucune donnée</div>
        );
    }

    return (
        <Accordion variant="shadow" className="w-full">
            {items.map((item) => (
                <AccordionItem
                    key={getKey(item)}
                    title={<div>{getHeaderContent(item)}</div>}
                >
                    <div className="space-y-2 py-2">
                        {getBodyContent(item)}
                        <div className="pt-2 flex justify-between items-center w-full">
                            {showViewButton && onView && (
                                <Button
                                    size="sm"
                                    onPress={() => {
                                        onView(item);
                                    }}
                                >
                                    Voir
                                </Button>
                            )}
                            <div>
                                <ThreeDotMenu
                                    actions={getActions(
                                        item,
                                        setLoadingId,
                                        loadingId,
                                    )}
                                />
                                {loadingId === getKey(item) && (
                                    <CircularProgress
                                        size="sm"
                                        className="ml-2 inline-block align-middle"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
