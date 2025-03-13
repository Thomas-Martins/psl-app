import SearchIcon from "@components/ui/icons/SearchIcon.tsx";
import { ChangeEvent } from "react";
import { Input } from "@heroui/react";

interface SearchInputProps {
    setSearch: (search: string) => void;
}
export default function SearchInput({ setSearch }: SearchInputProps) {
    return (
        <Input
            className="w-1/4"
            placeholder="Recherchez.."
            radius="lg"
            type="text"
            startContent={<SearchIcon size={24} color="grey" />}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setSearch(event.target.value);
            }}
        />
    );
}
