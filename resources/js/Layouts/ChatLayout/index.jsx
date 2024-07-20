import { ConversationItem } from "@/Layouts/ChatLayout/components/ConversationItem";
import TextInput from "@/Components/TextInput";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { useEventBus } from "@/EventBus";
import { GroupModal } from "@/Components/App/GroupModal";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    const [onlineUsers, setOnlineUsers] = useState({});
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const { on } = useEventBus();

    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (event) => {
        const search = event.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                    conversation.name.toLowerCase().includes(search) ||
                    conversation.email.toLowerCase().includes(search)
                );
            })
        );
    };

    const messageCreated = (message) => {
        setLocalConversations((oldConversations) => {
            return oldConversations.map((c) => {
                if (
                    message.receiver_id &&
                    !c.is_group &&
                    (c.id == message.sender_id || c.id == message.receiver_id)
                ) {
                    c.last_message = message.message;
                    c.last_message_date = message.created_at;
                    return c;
                }

                if (
                    message.group_id &&
                    c.is_group &&
                    c.id == message.group_id
                ) {
                    c.last_message = message.message;
                    c.last_message_date = message.created_at;
                    return c;
                }
                return c;
            });
        });
    };
    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) return;

        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offshowModal = on("GroupModal.show", () => {
            setShowGroupModal(true);
        });

        return () => {
            offCreated();
            offDeleted();
            offshowModal();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at)
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                if (a.blocked_at) return 1;
                if (b.blocked_at) return -1;
                if (a.last_message_date && b.last_message_date)
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                if (a.last_message_date) return -1;
                if (b.last_message_date) return 1;
                return 0;
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.error("error", error);
            });
        return () => {
            Echo.leave("online");
        };
    }, []);

    return (
        <>
            <div className="flex flex-1 w-full overflow-hidden">
                <aside
                    className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden dark:text-gray-200 ${
                        selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Group"
                        >
                            <button
                                onClick={() => setShowGroupModal(true)}
                                className="text-gray-400 hoverfocus:text-gray-200"
                            >
                                <HiPencilSquare className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isUserOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </aside>
                <div className="flex flex-1 flex-col overflow-hidden">
                    {children}
                </div>
            </div>
            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
            />
        </>
    );
};

export default ChatLayout;
