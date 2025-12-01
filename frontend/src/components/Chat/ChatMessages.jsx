import React, { useEffect, useRef } from "react";
import { useMessageStore } from "../../stores/messageStore.jsx";
import { useAuthStore } from "../../stores/authStore.jsx";
import { useState } from "react";

const ChatMessages = ({ room }) => {
  const { message, getMessages } = useMessageStore();
  const { authUser, checkAuth } = useAuthStore();
  const [user,setUser]=useState(null);
  const bottomRef = useRef(null);
  const [mes,setmes]= useState([]);
  // On mount / when room changes: check auth + load messages for that room
  useEffect(() => {
    const init = async () => {
      // await checkAuth();

      if (room?._id) {
        // get messages of this room (make sure your backend expects id)
        const res=await getMessages(room._id);
        setmes(res)
      }
    };

    init();
  }, [room?._id,message]);
  const checkUser= async () => {
    const res=await checkAuth();
    setUser(res.user);
  }

  useEffect(() => {
    checkUser();
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mes.length]);

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat room to start chatting
      </div>
    );
  }

  return (

    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {mes.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No messages yet</p>
      ) : (
        mes.map((msg, index) => {
          // Handle sender id comparison safely
          const senderId = String(msg.sender?._id || msg.sender || "");
          const authId = String(user?._id || "");

          const isSender = senderId === authId;

          // Format time from createdAt
          const timeLabel = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={msg._id || `${msg.createdAt}-${index}`} // ✅ unique key
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

                {timeLabel && (
                  <p
                    className={`mt-1 text-xs ${
                      isSender ? "text-green-100" : "text-gray-400"
                    }`}
                  >
                    {timeLabel}
                  </p>
                )}
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
