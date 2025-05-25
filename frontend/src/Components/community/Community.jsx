import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [personalMode, setPersonalMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [personalMessages, setPersonalMessages] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [requestStatus, setRequestStatus] = useState(""); // "pending", "accepted", "rejected", "none"
  const [showUserModal, setShowUserModal] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Redux state
  const { loginUserStatus, currentUser } = useSelector(
    (state) => state.useruserLoginReducer
  );

  // Fetch all users for dropdown
  const fetchUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data.users.filter((u) => u.username !== currentUser.username));
  };

  // Fetch community messages
  const fetchMessages = async () => {
    const res = await axios.get("/community/messages");
    setMessages(res.data.messages);
  };

  // Fetch personal messages
  const fetchPersonalMessages = async (otherUser) => {
    try {
      const res = await axios.get(`/personal/messages/${otherUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPersonalMessages(res.data.messages || []);
    } catch (err) {
      setPersonalMessages([]); // Always set to array on error
      // Optionally, set a state to show "You can't chat until request is accepted"
    }
  };

  // Fetch requests
  const fetchRequests = async () => {
    if (!loginUserStatus) return;
    const res = await axios.get("/personal/requests", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRequests({
      incoming: res.data.incoming || [],
      outgoing: res.data.outgoing || [],
    });
  };

  useEffect(() => {
    if (personalMode && loginUserStatus) {
      fetchUsers();
    }
    fetchMessages();
    const interval = setInterval(() => {
      if (personalMode && selectedUser) {
        fetchPersonalMessages(selectedUser);
      } else {
        fetchMessages();
      }
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [personalMode, selectedUser, loginUserStatus]);

  // Check request status for selected user
  useEffect(() => {
    if (personalMode && selectedUser) {
      const checkStatus = async () => {
        await fetchRequests();
        setTimeout(() => {
          setRequests((prevRequests) => {
            const outgoing = (prevRequests.outgoing || []).find((r) => r.to === selectedUser);
            const incoming = (prevRequests.incoming || []).find((r) => r.from === selectedUser);
            if (outgoing) setRequestStatus(outgoing.status);
            else if (incoming) setRequestStatus(incoming.status);
            else setRequestStatus("none");
            return prevRequests;
          });
        }, 0);
      };
      checkStatus();
    } else {
      setRequestStatus("none");
    }
    // eslint-disable-next-line
  }, [personalMode, selectedUser, loginUserStatus]);

  // Poll for incoming/outgoing requests every 2 seconds for the logged-in user
  useEffect(() => {
    if (loginUserStatus) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 2000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [loginUserStatus]);

  // Send message (community or personal)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      if (personalMode && selectedUser) {
        await axios.post(
          "/personal/message",
          {
            to: selectedUser,
            message: input,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setInput("");
        fetchPersonalMessages(selectedUser);
      } else {
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
      }
    } catch (err) {
      alert("Failed to send message");
    }
    setSending(false);
  };

  // Modal for user selection
  const UserModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={() => setShowUserModal(false)}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          minWidth: 300,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ color: "#ff9800", marginBottom: 16 }}>Select a user to chat</h3>
        <div
          style={{ maxHeight: 300, overflowY: "auto" }}
          onWheel={e => {
            // Always prevent wheel event from bubbling to parent/background
            e.stopPropagation();
          }}
        >
          {users.map(u => (
            <div
              key={u.username}
              style={{
                padding: "12px 16px",
                marginBottom: 8,
                borderRadius: 8,
                background: "#fffbe7",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#ff9800",
                border: selectedUser === u.username ? "2px solid #ff9800" : "1px solid #ffe0b2",
                transition: "border 0.2s",
              }}
              onClick={() => {
                setSelectedUser(u.username);
                setShowUserModal(false);
              }}
            >
              {u.username}
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowUserModal(false)}
          style={{
            marginTop: 16,
            background: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 24px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  // Send chat request
  const sendChatRequest = async () => {
    try {
      await axios.post(
        "/personal/request",
        { to: selectedUser },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRequestStatus("pending");
      fetchRequests();
      toast.success("Chat request sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  // Respond to request
  const respondToRequest = async (from, action) => {
    try {
      await axios.post(
        "/personal/request/respond",
        { from, action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchRequests();
      setRequestStatus(action === "accept" ? "accepted" : "rejected");
      toast.success(`Request ${action}ed`);
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  useEffect(() => {
    if (personalMode && loginUserStatus) {
      fetchUsers();
    }
    fetchMessages();
    const interval = setInterval(() => {
      if (personalMode && selectedUser) {
        fetchPersonalMessages(selectedUser);
      } else {
        fetchMessages();
      }
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [personalMode, selectedUser, loginUserStatus]);

  // Check request status for selected user
  useEffect(() => {
    if (personalMode && selectedUser) {
      const checkStatus = async () => {
        await fetchRequests();
        setTimeout(() => {
          setRequests((prevRequests) => {
            const outgoing = (prevRequests.outgoing || []).find((r) => r.to === selectedUser);
            const incoming = (prevRequests.incoming || []).find((r) => r.from === selectedUser);
            if (outgoing) setRequestStatus(outgoing.status);
            else if (incoming) setRequestStatus(incoming.status);
            else setRequestStatus("none");
            return prevRequests;
          });
        }, 0);
      };
      checkStatus();
    } else {
      setRequestStatus("none");
    }
    // eslint-disable-next-line
  }, [personalMode, selectedUser, loginUserStatus]);

  // Poll for incoming/outgoing requests every 2 seconds for the logged-in user
  useEffect(() => {
    if (loginUserStatus) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 2000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [loginUserStatus]);

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
        marginTop: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 32,        // <-- Add this for fixed top margin
          marginBottom: 24,     // <-- Slightly larger bottom margin for separation
          alignItems: "center", // <-- Vertically align buttons and info
          minHeight: 56,        // <-- Reserve space so layout doesn't jump
          position: "relative", // <-- For future enhancements if needed
        }}
      >
        <button
          onClick={() => setPersonalMode(false)}
          style={{
            background: !personalMode ? "#ff9800" : "#fff",
            color: !personalMode ? "#fff" : "#ff9800",
            border: "1px solid #ff9800",
            borderRadius: 8,
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: "pointer",
            minWidth: 140,
            transition: "background 0.2s, color 0.2s",
          }}
        >
          Community Chat
        </button>
        {loginUserStatus && (
          <button
            onClick={() => setPersonalMode(true)}
            style={{
              background: personalMode ? "#ff9800" : "#fff",
              color: personalMode ? "#fff" : "#ff9800",
              border: "1px solid #ff9800",
              borderRadius: 8,
              padding: "8px 18px",
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: 140,
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Personal Chat
          </button>
        )}
        {personalMode && loginUserStatus && (
          <div
            style={{
              marginLeft: 12,
              padding: "8px 18px",
              borderRadius: 8,
              border: "1px solid #ff9800",
              fontWeight: "bold",
              color: "#ff9800",
              background: "#fffbe7",
              display: "flex",
              alignItems: "center",
              gap: 8,
              minHeight: 40,
            }}
          >
            <span>Chatting with:</span>
            <span style={{ color: "#ff9800", fontWeight: "bold" }}>{selectedUser}</span>
            <button
              onClick={() => setShowUserModal(true)}
              style={{
                marginLeft: 8,
                background: "#fff",
                color: "#ff9800",
                border: "1px solid #ff9800",
                borderRadius: 6,
                padding: "2px 10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Change
            </button>
          </div>
        )}
      </div>
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
          {personalMode && selectedUser
            ? `Chat with ${selectedUser}`
            : "Community Chat"}
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
          {personalMode && selectedUser
            ? Array.isArray(personalMessages) && personalMessages.length === 0 ? (
                <div style={{ color: "#aaa", textAlign: "center" }}>
                  No messages yet.
                </div>
              ) : (
                personalMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf:
                        msg.from === currentUser.username
                          ? "flex-end"
                          : "flex-start",
                      maxWidth: "70%",
                      background:
                        msg.from === currentUser.username
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
                      {msg.from}
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
                ))
              )
            : messages.length === 0 ? (
                <div style={{ color: "#aaa", textAlign: "center" }}>
                  No messages yet.
                </div>
              ) : (
                messages.map((msg, idx) => (
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
                ))
              )}
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
            disabled={
              !loginUserStatus ||
              sending ||
              (personalMode && (!selectedUser || requestStatus !== "accepted"))
            }
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
            disabled={
              !loginUserStatus ||
              sending ||
              !input.trim() ||
              (personalMode && (!selectedUser || requestStatus !== "accepted"))
            }
            style={{
              background: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0 28px",
              fontWeight: "bold",
              fontSize: 17,
              cursor: loginUserStatus ? "pointer" : "not-allowed",
              opacity:
                !loginUserStatus ||
                sending ||
                !input.trim() ||
                (personalMode && (!selectedUser || requestStatus !== "accepted"))
                  ? 0.6
                  : 1,
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
          ? personalMode
            ? selectedUser
              ? `Chatting with ${selectedUser}`
              : "Select a user to start personal chat."
            : "You can chat with everyone in the community!"
          : "Login to participate in the chat."}
      </div>
      {personalMode && selectedUser && (
        <>
          {(requestStatus === "none" || requestStatus === "rejected") && (
  <button
    onClick={sendChatRequest}
    style={{
      margin: 8,
      background: "linear-gradient(90deg, #ffb347 0%, #ff9800 100%)",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 28px",
      fontWeight: "bold",
      fontSize: 16,
      cursor: "pointer",
      boxShadow: "0 2px 8px #ff980044",
      transition: "background 0.2s, box-shadow 0.2s",
    }}
    onMouseOver={e => e.currentTarget.style.background = "#ff9800"}
    onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #ffb347 0%, #ff9800 100%)"}
  >
    <span role="img" aria-label="request">💬</span> Send Chat Request
  </button>
)}
          {requestStatus === "pending" && (
            <div
              style={{
                color: "#888",
                margin: 8,
                background: "#fffbe7",
                border: "1px solid #ff9800",
                borderRadius: 8,
                padding: "10px 24px",
                fontWeight: "bold",
                fontSize: 15,
                display: "inline-block",
              }}
            >
              <span role="img" aria-label="pending">⏳</span> Request Pending...
            </div>
          )}
          {requestStatus === "rejected" && (
            <div
              style={{
                color: "#fff",
                margin: 8,
                background: "#f44336",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontWeight: "bold",
                fontSize: 15,
                display: "inline-block",
              }}
            >
              <span role="img" aria-label="rejected">❌</span> Request Rejected. You can view previous messages but cannot send new ones.
            </div>
          )}
          {requestStatus === "accepted" && (
            <button
              onClick={async () => {
                try {
                  await axios.post(
                    "/personal/request/revoke",
                    { otherUser: selectedUser },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                  );
                  setRequestStatus("rejected");
                  toast.info("Access revoked. You can send a new request to chat again.");
                  fetchRequests();
                } catch (err) {
                  toast.error("Failed to revoke access");
                }
              }}
              style={{
                margin: 8,
                background: "linear-gradient(90deg, #ff9800 0%, #f44336 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 28px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px #f4433644",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "#f44336"}
              onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #ff9800 0%, #f44336 100%)"}
            >
              <span role="img" aria-label="revoke">🚫</span> Revoke Access
            </button>
          )}
        </>
      )}
      {requests.incoming &&
        requests.incoming
          .filter((r) => r.status === "pending")
          .map((r) => (
            <div
              key={r.from}
              style={{
                background: "#fffbe7",
                border: "1px solid #ff9800",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px #ff980044",
              }}
            >
              <span>
                <b style={{ color: "#ff9800" }}>{r.from}</b> wants to chat with you.
              </span>
              <span>
                <button
                  onClick={() => respondToRequest(r.from, "accept")}
                  style={{
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 12px",
                    marginRight: 6,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToRequest(r.from, "reject")}
                  style={{
                    background: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
      {showUserModal && <UserModal />}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
