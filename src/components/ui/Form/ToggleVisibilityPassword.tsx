import EyeClosedIcon from "../icons/EyeClosedIcon.tsx";
import EyeOpenIcon from "../icons/EyeOpenIcon.tsx";

interface ToggleVisibilityPasswordProps {
    visible: boolean;
    setVisibility: () => void;
}
export default function ToggleVisibilityPassword({
    visible,
    setVisibility,
}: ToggleVisibilityPasswordProps) {
    return (
        <button onClick={setVisibility}>
            {visible ? (
                <EyeOpenIcon color={"#A1A1AA"} />
            ) : (
                <EyeClosedIcon color={"#A1A1AA"} />
            )}
        </button>
    );
}
