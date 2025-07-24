import React from "react";
import GridIcon from "@components/ui/icons/GridIcon";
import ListIcon from "@components/ui/icons/ListIcon";

interface ToggleGridProps {
    view: "grid" | "list";
    onChange: (view: "grid" | "list") => void;
}

const ToggleGrid: React.FC<ToggleGridProps> = ({ view, onChange }) => {
    return (
        <div className="flex gap-2 items-center">
            <button
                aria-label="Grid view"
                onClick={() => onChange("grid")}
                type="button"
            >
                <GridIcon
                    color={view === "grid" ? "white" : "#63B7F7"}
                    size={25}
                />
            </button>
            <button
                aria-label="List view"
                onClick={() => onChange("list")}
                type="button"
            >
                <ListIcon
                    color={view === "list" ? "white" : "#63B7F7"}
                    size={25}
                />
            </button>
        </div>
    );
};

export default ToggleGrid;
