// Construct WebSocket base URL based on backend URL (strip "/api" and "https://")

const WS_BASE = `wss://${import.meta.env.VITE_BACKEND_URL.replace("/api", "").replace("https://", "")}/ws/chat`;
export default WS_BASE;


