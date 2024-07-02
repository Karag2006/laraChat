import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";

import { UserAvatar } from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    return (
        <div
            className={`
                chat ${
                    message.sender_id === currentUser.id
                        ? "chat-end"
                        : "chat-start"
                }
            `}
        >
            {<UserAvatar user={message.sender} />}
            <div className="chat-header">
                {message.sender_id !== currentUser.id
                    ? message.sender.name
                    : ""}
                <time className="text-xs opacity-50 ml-2">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>
            <div
                className={`chat-bubble relative ${
                    message.sender_id === currentUser.id
                        ? "chat-bubble-info"
                        : ""
                }
                `}
            >
                <div className="chat-message">
                    <div className="chat-message-content">
                        <ReactMarkdown
                            children={message.message}
                            components={{
                                code(props) {
                                    const {
                                        children,
                                        className,
                                        node,
                                        ...rest
                                    } = props;
                                    const match = /language-(\w+)/.exec(
                                        className || ""
                                    );
                                    return match ? (
                                        <SyntaxHighlighter
                                            {...rest}
                                            PreTag="div"
                                            children={String(children).replace(
                                                /\n$/,
                                                ""
                                            )}
                                            language={match[1]}
                                            style={oneDark}
                                        />
                                    ) : (
                                        <code {...rest} className={className}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
