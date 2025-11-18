import React, { useEffect, useRef } from "react";
import { useMessageStore } from "../../stores/messageStore.jsx";
import { useAuthStore } from "../../stores/authStore.jsx";

const ChatMessages = ({ room }) => {
  const { message } = useMessageStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {message.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No messages yet</p>
      ) : (
        message.map((msg) => {
          const isSender = msg.sender?._id === authUser?._id || msg.sender === authUser?._id;
          return (
            <div
              key={msg._id || msg.createdAt}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                  isSender
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                <p>{msg.content || msg.message}</p>
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
