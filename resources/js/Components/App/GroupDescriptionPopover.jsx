import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { HiExclamationCircle } from "react-icons/hi2";

export const GroupDescriptionPopover = ({ description = "" }) => {
    return (
        <Popover className="relative group">
            <PopoverButton className="p-1 text-gray-400 hoverfocus:text-gray-300 group-data-[open]:text-gray-200">
                <HiExclamationCircle className="w-4" />
            </PopoverButton>
            <PopoverPanel
                anchor="top end"
                transition
                className="flex origin-top flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <div className="rounded-lg overflow-hidden shadow-lg ring-1 ring-black/5">
                    <div className="bg-gray-800 p-4">
                        <h2 className="text-lg mb-3">Description</h2>
                        {description ? (
                            <div className="text-xs">{description}</div>
                        ) : (
                            <div className="text-xs text-gray-500 text-center">
                                No description is defined
                            </div>
                        )}
                    </div>
                </div>
            </PopoverPanel>
        </Popover>
    );
};
