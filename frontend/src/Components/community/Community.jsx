import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Redux state
  const { loginUserStatus, currentUser } = useSelector(
    (state) => state.useruserLoginReducer
  );

  // Fetch messages
  const fetchMessages = async () => {
    const res = await axios.get("/community/messages");
    setMessages(res.data.messages);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      await axios.post(
        "/community/message",
        {
          username: currentUser.username,
          message: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setInput("");
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
    }
    setSending(false);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 0px)",
        width: "100vw",
        background: "linear-gradient(120deg, #fffbe7 0%, #ffe0b2 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        margin: 0,
        marginTop: "60px", // space below navbar
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          height: "80vh",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(255,152,0,0.10)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 32px",
            borderBottom: "1px solid #ffe0b2",
            fontWeight: "bold",
            fontSize: 26,
            color: "#ff9800",
            letterSpacing: 1,
            background: "#fff8e1",
          }}
        >
          Community Chat
        </div>
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 24px",
            background: "linear-gradient(135deg, #fffbe7 60%, #fff 100%)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#aaa", textAlign: "center" }}>
              No messages yet.
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf:
                  loginUserStatus && msg.username === currentUser.username
                    ? "flex-end"
                    : "flex-start",
                maxWidth: "70%",
                background:
                  loginUserStatus && msg.username === currentUser.username
                    ? "linear-gradient(135deg, #ffe0b2 60%, #fff3e0 100%)"
                    : "linear-gradient(135deg, #e3f2fd 60%, #fff 100%)",
                color: "#333",
                borderRadius: "18px 18px 4px 18px",
                padding: "14px 20px",
                boxShadow: "0 2px 8px rgba(255,152,0,0.06)",
                marginBottom: 2,
                position: "relative",
                wordBreak: "break-word",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "#ff9800",
                  marginBottom: 2,
                }}
              >
                {msg.username || `User`}
              </div>
              <div style={{ fontSize: 16 }}>{msg.message}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "#888",
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleString()
                  : ""}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSend}
          style={{
            borderTop: "1px solid #ffe0b2",
            padding: 20,
            background: "#fff",
            display: "flex",
            gap: 12,
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              loginUserStatus
                ? "Type your message..."
                : "Login to send a message"
            }
            disabled={!loginUserStatus || sending}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #ffd580",
              fontSize: 17,
              outline: "none",
              background: loginUserStatus ? "#fff" : "#f5f5f5",
              boxShadow: "0 1px 4px rgba(255,152,0,0.04)",
            }}
          />
          <button
            type="submit"
            disabled={!loginUserStatus || sending || !input.trim()}
            style={{
              background: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0 28px",
              fontWeight: "bold",
              fontSize: 17,
              cursor: loginUserStatus ? "pointer" : "not-allowed",
              opacity: !loginUserStatus || sending || !input.trim() ? 0.6 : 1,
              transition: "opacity 0.2s",
              boxShadow: "0 2px 8px rgba(255,152,0,0.08)",
            }}
          >
            Send
          </button>
        </form>
      </div>
      <div style={{ marginTop: 24, color: "#888", textAlign: "center" }}>
        {loginUserStatus
          ? "You can chat with everyone in the community!"
          : "Login to participate in the chat."}
      </div>
    </div>
  );
}

export default App;
