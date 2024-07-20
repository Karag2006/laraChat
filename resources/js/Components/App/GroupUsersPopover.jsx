import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import { HiUsers } from "react-icons/hi2";
import { UserAvatar } from "./UserAvatar";

export const GroupUsersPopover = ({ users = [] }) => {
    return (
        <Popover className="relative group">
            <PopoverButton className="p-1 text-gray-400 hoverfocus:text-gray-300 group-data-[open]:text-gray-200">
                <HiUsers className="w-4" />
            </PopoverButton>
            <PopoverPanel
                anchor="top end"
                transition
                className="flex origin-top flex-col z-20 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <div className="rounded-lg overflow-hidden shadow-lg ring-1 ring-black/5">
                    <div className="bg-gray-800 py-2">
                        {users.map((user) => (
                            <Link
                                href={route("chat.user", user.id)}
                                key={user.id}
                                className="flex items-center gap-2 py-2 px-3 hoverfocus:bg-black/30"
                            >
                                <UserAvatar user={user} />
                                <div className="text-xs">{user.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </PopoverPanel>
        </Popover>
    );
};
