import SearchIcon from "@components/ui/icons/SearchIcon.tsx";
import { ChangeEvent } from "react";
import { Input } from "@heroui/react";
import i18n from "@core/i18n/i18n.ts";

interface SearchInputProps {
    setSearch: (search: string) => void;
    classNames?: string;
}
export default function SearchInput({
    setSearch,
    classNames = "",
}: SearchInputProps) {
    return (
        <Input
            className={classNames}
            placeholder={i18n.t("generics.search")}
            radius="lg"
            type="text"
            startContent={<SearchIcon size={24} color="grey" />}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value);
            }}
        />
    );
}
