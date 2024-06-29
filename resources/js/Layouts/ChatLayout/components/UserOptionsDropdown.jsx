import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import {
    HiEllipsisVertical,
    HiLockClosed,
    HiLockOpen,
    HiShieldCheck,
    HiUser,
} from "react-icons/hi2";

export const UserOptionsDropdown = ({ conversation }) => {
    const changeUserRole = () => {
        console.log("Change User role");
        if (!conversation.is_user) return;

        axios
            .post(route("user.changeRole", conversation.id))
            .then((result) => {
                console.log(result.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const onBlockUser = () => {
        console.log("Block user");
        if (!conversation.is_user) return;

        axios
            .post(route("user.blockUnblock", conversation.id))
            .then((result) => {
                console.log(result.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <Menu>
                <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full hoverfocus:bg-black/40">
                    <HiEllipsisVertical className="w-5 h-5" />
                </MenuButton>

                <MenuItems
                    transition
                    anchor="right"
                    className="mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                    <div className="px-1 py-1">
                        <MenuItem>
                            <button
                                onClick={onBlockUser}
                                className={`data-[focus]:bg-black/30 data-[focus]:text-white text-gray-100 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                                {conversation.blocked_at && (
                                    <>
                                        <HiLockOpen className="w-4 h-4 mr-2" />
                                        Unblock User
                                    </>
                                )}
                                {!conversation.blocked_at && (
                                    <>
                                        <HiLockClosed className="w-4 h-4 mr-2" />
                                        Block User
                                    </>
                                )}
                            </button>
                        </MenuItem>
                    </div>
                    <div className="px-1 py-1">
                        <MenuItem>
                            <button
                                onClick={changeUserRole}
                                className="data-[focus]:bg-black/30 data-[focus]:text-white text-gray-100 group flex w-full items-center rounded-md px-2 py-2 text-sm"
                            >
                                {conversation.is_admin && (
                                    <>
                                        <HiUser className="w-4 h-4 mr-2" />
                                        Make Regular User
                                    </>
                                )}
                                {!conversation.is_admin && (
                                    <>
                                        <HiShieldCheck className="w-4 h-4 mr-2" />
                                        Make Admin
                                    </>
                                )}
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
};
