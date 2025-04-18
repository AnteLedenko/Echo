import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import WS_BASE from "../../utils/wsBase";
import Layout from "../../components/Layout";


const ChatRoom = () => {
  const CLOUDINARY_BASE = import.meta.env.VITE_CLOUDINARY_BASE_URL;
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState(null);
  const [socket, setSocket] = useState(null);
  const bottomRef = useRef(null);
  const currentUserId = parseInt(localStorage.getItem("user_id"));
  const token = localStorage.getItem("access");

  // Fetch chat data and mark messages as seen
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`chat/${chatId}/`);
        setMessages(res.data.messages);
        setChatData(res.data.chat);

        await axiosInstance.post(`chat/${chatId}/seen/`);
        window.dispatchEvent(new CustomEvent("messages-seen"));
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/auth/login";
        }
      }
    };
    fetchData();
  }, [chatId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up WebSocket connection for real-time messaging
  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket(`${WS_BASE}/${chatId}/?token=${token}`);

    ws.onopen = () => {setSocket(ws);};

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Dispatch a global event for any other listeners
      window.dispatchEvent(new CustomEvent("new-message", { detail: data }));

      const normalized = {
        ...data,
        sender: { id: data.sender_id },
      };

      setMessages((prev) => Array.isArray(prev) ? [...prev, normalized] : [normalized]);
    };

    return () => {ws.close();};

  }, [chatId, token]);

  // Send message through WebSocket
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({ message: input }));
    setInput("");
  };

  const receiver = chatData?.participants?.find((u) => u.id !== currentUserId) || null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-6 bg-white shadow rounded overflow-hidden">
        {/* Chat header with receiver's avatar and name */}
        <div className="flex items-center gap-4 p-4 border-b bg-purple-100">
          {receiver && (
            <>
              {receiver.profile_picture ? (
                <img
                  src={`${CLOUDINARY_BASE}/${receiver.profile_picture}`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                  {receiver.first_name?.[0] || "?"}
                </div>
              )}

              <Link
                to={`/auth/profile/${receiver.id}`}
                className="font-semibold text-purple-700 hover:underline"
              >
                {receiver.first_name} {receiver.last_name}
              </Link>
            </>
          )}
        </div>

        <div className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-gray-50">
        {Array.isArray(messages) &&
          messages.map((msg, index) => {
          const isSender = msg.sender.id === currentUserId;
          const isLast = index === messages.length - 1;
          return (
          <div key={index} className={`flex ${msg.sender?.id === currentUserId ? "justify-end" : "justify-start"}`}>
              <div className="max-w-xs">
                  <p className={`text-xs mb-1 ${isSender ? "text-right text-purple-600" : "text-left text-gray-500"}`}>
                  {isSender ? "You" : `${receiver?.first_name || "User"}`}
                  </p>

                  <div
                    className={`px-4 py-2 rounded-2xl shadow ${
                        msg.sender?.id === currentUserId
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-white text-purple-800 border border-purple-300 rounded-bl-none"
                    }`}
                    >
                    <p className="text-sm">{msg.message || msg.content}</p>
                    <span className="text-[0.65rem] block mt-1 text-right opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                    </span>
                  </div>

                  {/* Show "Seen" for the last sent message */}
                  {isSender && isLast && msg.is_read && (
                  <p className="text-xs text-right text-purple-500 mt-1">Seen</p>
                  )}
              </div>
          </div>
          );
          })}
      <div ref={bottomRef}></div>
    </div>

        {/* Message input form */}
        <form onSubmit={handleSend} className="flex items-center border-t p-4 gap-2 bg-white">
          <input type="text" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-grow border px-4 py-2 rounded"/>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Send
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ChatRoom;
