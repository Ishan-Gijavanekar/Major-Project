import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const ChatSidebar = ({ chatRooms, activeRoom, onSelectRoom }) => {
  return (
    <div className="w-80 bg-gray-800 bg-opacity-60 border-r border-gray-700 hidden md:flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Chats
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatRooms.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No chat rooms yet</p>
        ) : (
          chatRooms.map((room) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={room._id}
              className={`p-4 cursor-pointer border-b border-gray-700 transition-all ${
                activeRoom?._id === room._id
                  ? "bg-gray-700 bg-opacity-60"
                  : "hover:bg-gray-700 hover:bg-opacity-40"
              }`}
              onClick={() => onSelectRoom(room)}
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="text-green-400" size={22} />
                <div>
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {room.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
