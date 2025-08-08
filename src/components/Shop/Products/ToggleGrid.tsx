import { FC } from "react";
import GridIcon from "@components/ui/icons/GridIcon";
import ListIcon from "@components/ui/icons/ListIcon";
import { useIsDark } from "@/utils/hook/useIsDark";

interface ToggleGridProps {
    view: "grid" | "list";
    onChange: (view: "grid" | "list") => void;
}

const getIconColor = (selected: boolean, isDark: boolean) => {
    if (selected) return "white";
    return isDark ? "#4F4F4F" : "#63B7F7";
};

const ToggleGrid: FC<ToggleGridProps> = ({ view, onChange }) => {
    const isDark = useIsDark();

    return (
        <div className="flex gap-2 items-center">
            <button
                aria-label="Grid view"
                onClick={() => onChange("grid")}
                type="button"
            >
                <GridIcon
                    color={getIconColor(view === "grid", isDark)}
                    size={25}
                />
            </button>
            <button
                aria-label="List view"
                onClick={() => onChange("list")}
                type="button"
            >
                <ListIcon
                    color={getIconColor(view === "list", isDark)}
                    size={25}
                />
            </button>
        </div>
    );
};

export default ToggleGrid;
