import { FC, useEffect, useState } from "react";
import GridIcon from "@components/ui/icons/GridIcon";
import ListIcon from "@components/ui/icons/ListIcon";

interface ToggleGridProps {
    view: "grid" | "list";
    onChange: (view: "grid" | "list") => void;
}

const getIconColor = (selected: boolean, isDark: boolean) => {
    if (selected) return "white";
    return isDark ? "#4F4F4F" : "#63B7F7";
};

const ToggleGrid: FC<ToggleGridProps> = ({ view, onChange }) => {
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark"),
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

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
