import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState("");
  const [unreadTotal, setUnreadTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  
    if (token) {
      fetchUnreadMessages();
    }
  
    const handleNewMessage = () => {
      fetchUnreadMessages();
    };
  
    const handleMessagesSeen = () => {
      fetchUnreadMessages();
    };
  
    window.addEventListener("new-message", handleNewMessage);
    window.addEventListener("messages-seen", handleMessagesSeen);
  
    return () => {
      window.removeEventListener("new-message", handleNewMessage);
      window.removeEventListener("messages-seen", handleMessagesSeen);
    };
  }, [location]);
  
  const fetchUnreadMessages = async () => {
    try {
      const res = await axiosInstance.get("chat/");
      const total = res.data.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
      setUnreadTotal(total);
    } catch (err) {
      console.warn("Failed to fetch unread messages", err);
    }
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setDropdownOpen(false);
    }
  };

  return (
    <header className="bg-purple-600 text-white w-full fixed top-0 left-0 shadow-md z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="relative bg-purple-700 px-3 py-2 rounded hover:bg-purple-800 transition"
        >
          ☰ Menu
          {unreadTotal > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-[2px] rounded-full">
              {unreadTotal}
            </span>
          )}
        </button>

        <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4 hidden sm:flex">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full px-4 py-2 rounded text-black"
          />
          <button
            type="submit"
            className="w-40 ml-2 bg-white text-purple-700 py-2 rounded hover:bg-gray-100 transition"
          >
            Search
          </button>
        </form>

        <h1 className="text-xl font-bold">Echo</h1>
      </nav>

    
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="bg-purple-700 text-white px-4 py-3 space-y-2 shadow-lg"
        >
          <Link to="/" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">Home</Link>
          <Link to="/about" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">About</Link>
          <Link to="/categories" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">Categories</Link>

          {isAuthenticated ? (
            <>
              <Link to="/auth/profile" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">Profile</Link>

              <div className="relative">
              <Link to="/chat" onClick={handleLinkClick} className="flex items-center gap-2 hover:bg-purple-800 px-3 py-2 rounded">
                <span>Chat</span>
                {unreadTotal > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-[2px] rounded-full">
                    {unreadTotal}
                  </span>
                )}
              </Link>
              </div>

              <Link to="/auth/logout" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">Login</Link>
              <Link to="/auth/register" onClick={handleLinkClick} className="block hover:bg-purple-800 px-3 py-2 rounded">Register</Link>
            </>
          )}

          <form onSubmit={handleSearch} className="block sm:hidden mt-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-60 px-3 py-2 rounded text-black"
            />
            <button
              type="submit" onClick={handleLinkClick}
              className="w-30 ml-2 bg-white text-purple-700 py-2 rounded hover:bg-gray-100 transition"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navigation;
