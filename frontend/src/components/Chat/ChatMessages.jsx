import React, { useEffect, useRef } from "react";
import { useMessageStore } from "../../stores/messageStore.jsx";
import { useAuthStore } from "../../stores/authStore.jsx";
import { useSocketStore } from "../../stores/socketStore.jsx";

const ChatMessages = ({ room }) => {
  const { message } = useMessageStore();
  const { authUser } = useAuthStore();
  const { socket } = useSocketStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (msg) => {
        if (msg.room === room._id) {
          message.push(msg);
        }
      });
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => socket?.off("newMessage");
  }, [socket, room]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {message.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No messages yet</p>
      ) : (
        message.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender?._id === authUser?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                msg.sender?._id === authUser?._id
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
