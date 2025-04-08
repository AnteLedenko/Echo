const WS_BASE = import.meta.env.DEV
  ? "ws://127.0.0.1:8000/ws/chat"
  : `wss://${import.meta.env.VITE_BACKEND_HOST}/ws/chat`;

export default WS_BASE;
