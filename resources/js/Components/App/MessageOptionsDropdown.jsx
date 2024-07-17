import { useEventBus } from "@/EventBus";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import { HiEllipsisVertical, HiTrash } from "react-icons/hi2";

export const MessageOptionsDropdown = ({ message }) => {
    const { emit } = useEventBus();

    const onMessageDelete = () => {
        console.log("Delete Message");
        axios
            .delete(route("message.destroy", message.id))
            .then((result) => {
                emit("message.deleted", {
                    message,
                    prevMessage: result.data.message,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="absolute right-full text-gray-100 top-1/2 -translate-y-1/2 z-10">
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
                                onClick={onMessageDelete}
                                className={`data-[focus]:bg-black/30 data-[focus]:text-white text-gray-100 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                                <HiTrash className="w-4 h-4 mr-2" />
                                Delete Message
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
};
