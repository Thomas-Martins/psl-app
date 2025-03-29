import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store.ts";
import LogoutIcon from "@components/ui/icons/LogoutIcon.tsx";
import { useNavigate } from "react-router";
import { userSlice } from "@store/userSlice.ts";
import RoleChip from "@components/ui/global/RoleChip.tsx";
import { Role } from "@/types/Role.ts";

export default function UserAccountActivator() {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                        <RoleChip role={user.role as Role} />
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
