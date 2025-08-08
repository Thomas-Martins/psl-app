import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import MoonIcon from "../ui/icons/MoonIcon";
import SunIcon from "../ui/icons/SunIcon";

export default function ToggleTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <div>
            <Button
                variant="light"
                isIconOnly
                onPress={handleTheme}
                className="text-white"
                aria-label={
                    theme === "dark"
                        ? "Activer le thème clair"
                        : "Activer le thème sombre"
                }
            >
                {theme === "dark" ? (
                    <SunIcon color="white" size={24} />
                ) : (
                    <MoonIcon color="white" size={24} />
                )}
            </Button>
        </div>
    );
}
