import {
    Avatar,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import LogoutIcon from "@ui/icons/LogoutIcon.tsx";
import { useNavigate } from "react-router";
import { userSlice } from "@store/userSlice.ts";

export default function UserAccountActivator() {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const roleName = (role: string) => {
        switch (role) {
            case "admin":
                return "Administrateur";
            case "gestionnaire":
                return "Gestionnaire";
            case "logisticien":
                return "Logisticien";
        }
    };

    const chipRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-primary-400";
            case "gestionnaire":
                return "bg-violet";
            case "logisticien":
                return "bg-light-100";
        }
    };

    const handleLogout = () => {
        dispatch(userSlice.actions.clearUser());
        navigate("/login");
    };
    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <div className="flex flex-row items-center gap-6 cursor-pointer">
                    <div>
                        <p className="text-white">
                            {user.firstname + " " + user.lastname}
                        </p>
                        <Chip
                            className={"text-white " + chipRoleColor(user.role)}
                            radius="sm"
                            size="sm"
                        >
                            {roleName(user.role)}
                        </Chip>
                    </div>
                    <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        color="secondary"
                        name="Jason Hughes"
                        size="sm"
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="solid">
                <DropdownItem key="settings">Mon compte</DropdownItem>
                <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={handleLogout}
                    className="flex flex-row text-black"
                    startContent={<LogoutIcon size={15} />}
                >
                    Déconnexion
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
