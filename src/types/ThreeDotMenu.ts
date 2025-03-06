export interface ThreeDotMenuProps {
    actions?: {
        label: string;
        variant:
            | "default"
            | "danger"
            | "success"
            | "warning"
            | "primary"
            | "secondary"
            | undefined;
        onClick: () => void;
    }[];
}
