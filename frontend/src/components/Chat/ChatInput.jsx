import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useMessageStore } from "../../stores/messageStore.jsx";
import { useSocketStore } from "../../stores/socketStore.jsx";

const ChatInput = ({ room }) => {
  const [text, setText] = useState("");
  const { sendMessage } = useMessageStore();
  const { sendSocketMessage } = useSocketStore();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // 1. Save to API (DB), so it persists
    await sendMessage({ room: room._id, content: text });

    // 2. Send realtime - now unified via stores
    sendSocketMessage(room._id, text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-3 p-4 border-t border-gray-700 bg-gray-800 bg-opacity-70"
    >
      <input
        type="text"
        className="flex-1 p-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition"
      >
        <Send size={20} className="text-white" />
      </motion.button>
    </form>
  );
};

export default ChatInput;
