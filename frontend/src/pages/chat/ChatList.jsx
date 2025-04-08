import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";

const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axiosInstance.get("chat/");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats:", err);
      }
    };
  
    fetchChats();
  
    const handleNewMessage = () => {
      fetchChats();
    };
  
    window.addEventListener("new-message", handleNewMessage);
  
    return () => {
      window.removeEventListener("new-message", handleNewMessage);
    };
  }, []);
  
  const sortedChats = [...chats].sort((a, b) => {
    const aTime = a.last_message?.timestamp || a.created_at;
    const bTime = b.last_message?.timestamp || b.created_at;
    return new Date(bTime) - new Date(aTime);
  });

  const getOtherParticipant = (participants) =>
    participants?.find((user) => user.id !== currentUserId);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-6">
        <h1 className="text-2xl font-bold mb-4 text-purple-700">Chat</h1>
        <div className="bg-white shadow rounded divide-y">
          {sortedChats.map((chat) => {
            console.log("chat:", {
                id: chat.id,
                unread: chat.unread_count,
                lastMessage: chat.last_message?.content,
                timestamp: chat.last_message?.timestamp,
              });
            const other = getOtherParticipant(chat.participants);
            const lastMessage = chat.last_message;

            return (
              <div
                key={chat.id}
                className="p-4 flex items-start gap-4 hover:bg-gray-50 cursor-pointer relative"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <img
                  src={
                    other?.profile_picture
                      ? `${CLOUDINARY_BASE}/${other.profile_picture}`
                      : "https://via.placeholder.com/40"
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-grow">
                  <p className="font-semibold text-purple-700">
                    {other?.first_name} {other?.last_name}
                  </p>

                  <p className="text-xs italic text-gray-400 mb-1">
                    {chat.listing?.title || "Untitled Listing"}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage?.content || "No messages yet"}
                  </p>
                </div>

                <div className="flex flex-col items-end text-right text-xs text-gray-400 min-w-[60px]">
                  {lastMessage?.timestamp && (
                    <span>
                      {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                    {typeof chat.unread_count === "number" && chat.unread_count > 0 && (
                    <span className="mt-1 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                        {chat.unread_count}
                    </span>
                    )}
                </div>
              </div>
            );
          })}

          {chats.length === 0 && (
            <div className="p-4 text-center text-gray-500">No chats yet</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatList;
