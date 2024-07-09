import { useEffect, useRef } from "react";
import Message from "./Message";

const Messages = (props) => {
    const containerRef = useRef(null);
    const isScrolledUpRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;

        if (!isScrolledUpRef.current) {
            container.scrollTop = container.scrollHeight;
        }
    }, [props.messages]);

    const handleScroll = () => {
        const container = containerRef.current;
        // Calculate the difference between the scroll height and the scroll position plus container height
        const atBottom = container.scrollHeight - (container.scrollTop + container.clientHeight) < 1;

        // Update the isScrolledUpRef based on whether the user is actively scrolling up
        isScrolledUpRef.current = !atBottom;
    };

    function renderMessage(message, index) {
        message.outgoing = message.receiver !== props.user.id;
        return <Message key={index} message={message} />;
    }

    return (
        <div
            id="messages"
            ref={containerRef}
            onScroll={handleScroll}
            style={{ overflowY: "auto" }}
        >
            {props.messages.map(renderMessage)}
        </div>
    );
};

export default Messages;
