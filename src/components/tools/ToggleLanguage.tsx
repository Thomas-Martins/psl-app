import { Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";
import i18n from "@core/i18n/i18n";

// Mapping des codes de langue vers leur libellé

export default function ToggleLanguage() {
    const languages = Object.keys(i18n.options.resources || {});

    const defaultLang = localStorage.getItem("lang") || "fr";
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLang);

    useEffect(() => {
        if (!localStorage.getItem("lang")) {
            localStorage.setItem("lang", defaultLang);
        }
    }, [defaultLang]);

    const handleChange = (selectedLang: string) => {
        i18n.changeLanguage(selectedLang).then();
        localStorage.setItem("lang", selectedLang);
        setSelectedLanguage(selectedLang);
    };

    return (
        <div className="w-20">
            <Select
                aria-label="languages"
                defaultSelectedKeys={[selectedLanguage]}
                onChange={(event) => handleChange(event.target.value)}
            >
                {languages.map((lang) => (
                    <SelectItem key={lang} data-value={lang}>
                        {lang.toUpperCase()}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}
