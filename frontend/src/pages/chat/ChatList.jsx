import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "../../components/Layout";


const ChatList = () => {
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem("user_id"));

  // Fetch user's chat list and when a new message event is dispatched
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
  
    // Listener to refresh chat list when a new message is received
    const handleNewMessage = () => { fetchChats();};
    window.addEventListener("new-message", handleNewMessage);
  
    return () => {
      window.removeEventListener("new-message", handleNewMessage);
    };
  }, []);
  
  // Sort chats by most recent activity last message or created_at
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
            const other = getOtherParticipant(chat.participants);
            const lastMessage = chat.last_message;

            return (
                <div
                    key={chat.id}
                    className="p-4 flex items-start gap-4 hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => navigate(`/chat/${chat.id}`)}
                >
                    {other?.profile_picture ? (
                    <img
                        src={`${CLOUDINARY_BASE}/${other.profile_picture}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                      {other?.first_name?.[0] || "?"}
                    </div>
                    )}

                    <div className="flex-grow">
                    <p className="font-semibold text-purple-700">
                        {other?.first_name} {other?.last_name}
                    </p>

                    <p className="text-xs italic text-gray-400 mb-1">
                        {chat.listing?.title || "Untitled Listing"}
                    </p>

                    <p className="text-sm text-gray-500 truncate">
                     {lastMessage?.content
                        ? lastMessage.content.length > 20
                        ? lastMessage.content.slice(0, 20) + "..."
                        : lastMessage.content
                        : "No messages yet"}
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
