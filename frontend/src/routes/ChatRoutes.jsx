import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatList from "../pages/chat/ChatList";
import ChatRoom from "../pages/chat/ChatRoom";

const ChatRoutes = () => (
  <Routes>
    <Route path="/" element={<ChatList />} />
    <Route path=":chatId" element={<ChatRoom />} />
  </Routes>
);

export default ChatRoutes;
