import { Link, usePage } from "@inertiajs/react";
import { HiArrowLeft, HiPencilSquare, HiTrash } from "react-icons/hi2";
import { UserAvatar } from "./UserAvatar";
import { GroupAvatar } from "./GroupAvatar";
import { useEventBus } from "@/EventBus";
import { GroupDescriptionPopover } from "./GroupDescriptionPopover";
import { GroupUsersPopover } from "./GroupUsersPopover";

export const ConversationHeader = ({ selectedConversation }) => {
    const page = usePage();
    const authUser = page.props.auth.user;
    const { emit } = useEventBus();

    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete this Group?"))
            return;

        axios.delete(
            route("group.destroy", selectedConversation.id)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.error(error);
                })
        );
    };

    return (
        <>
            {selectedConversation && (
                <div className="flex justify-between items-center p-3 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <HiArrowLeft className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-gray-500">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUsersPopover
                                users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(event) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                )
                                            }
                                            className="text-gray-400 hoverfocus:text-gray-200"
                                        >
                                            <HiPencilSquare className="w-4" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-gray-400 hoverfocus:text-gray-200"
                                        >
                                            <HiTrash className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
