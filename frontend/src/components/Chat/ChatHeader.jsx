import React from "react";
import { Users } from "lucide-react";

const ChatHeader = ({ room }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800 bg-opacity-70">
      <div>
        <h2 className="text-xl font-bold text-green-400">{room.name}</h2>
        <p className="text-sm text-gray-400">
          {room.participants?.length || 0} participants
        </p>
      </div>
      <Users className="text-gray-400" />
    </div>
  );
};

export default ChatHeader;
