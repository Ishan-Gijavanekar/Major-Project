import React, { useEffect, useState } from "react";
import ChatSidebar from "../../components/Chat/ChatSidebar.jsx";
import ChatHeader from "../../components/Chat/ChatHeader.jsx";
import ChatMessages from "../../components/Chat/ChatMessages.jsx";
import ChatInput from "../../components/Chat/ChatInput.jsx";
import { useChatRoomStore } from "../../stores/chatRoomStore.jsx";
import { useMessageStore } from "../../stores/messageStore.jsx";
import { useSocketStore } from "../../stores/socketStore.jsx";
import { useSidebar } from "../../components/useSidebar";

const ChatPage = () => {
  const { chatRooms, getUserChatRoom } = useChatRoomStore();
  const { getMessages } = useMessageStore();
  const { joinRoom, leaveRoom, socket } = useSocketStore();
  const { isOpen: isSidebarOpen } = useSidebar();

  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    getUserChatRoom();
  }, []);

  useEffect(() => {
    if (activeRoom) {
      joinRoom(activeRoom._id);
      getMessages(activeRoom._id);
      return () => leaveRoom(activeRoom._id);
    }
  }, [activeRoom]);

  return (
    <div
      className={`min-h-screen bg-gray-50 px-8 py-2 transition-all duration-300 ${
        isSidebarOpen ? "ml-53" : "ml-10"
      }`}
    >
      <div className="flex h-screen bg-gray-900 text-white">
        <ChatSidebar
          chatRooms={chatRooms}
          activeRoom={activeRoom}
          onSelectRoom={setActiveRoom}
        />

        <div className="flex flex-col flex-1">
          {activeRoom ? (
            <>
              <ChatHeader room={activeRoom} />
              <ChatMessages room={activeRoom} />
              <ChatInput room={activeRoom} />
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400">
              <p>Select a chat room to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
