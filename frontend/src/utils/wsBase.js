const WS_BASE = `wss://${import.meta.env.VITE_BACKEND_URL.replace("/api", "").replace("https://", "")}/ws/chat`;

export default WS_BASE;

