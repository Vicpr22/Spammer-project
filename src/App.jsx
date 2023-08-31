import { useEffect, useState } from "react";
import { API } from "./assets/api/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null); // Track the ID of the message being edited

  async function fetchMessages() {
    const res = await fetch(`${API}/messages`);
    const info = await res.json();
    setMessages(info.messages);
  }

  async function handleLikes(message) {
    const res = await fetch(`${API}/message/${message.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: message.likes + 1 }),
    });
    const info = await res.json();
    fetchMessages();
  }

  async function handleDelete(messageId) {
    const res = await fetch(`${API}/message/${messageId}`, {
      method: "DELETE",
    });
    const info = await res.json();
    fetchMessages();
  }

  async function handleEdit(messageId, newText) {
    const res = await fetch(`${API}/message/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    });
    const info = await res.json();
    setEditingMessageId(null); // Clear the editing state
    fetchMessages();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (newMessage.trim() === "") {
      return;
    }

    const res = await fetch(`${API}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newMessage, likes: 0 }),
    });

    if (res.ok) {
      setNewMessage("");
      fetchMessages();
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div id="main-container">
      <h1>Spammer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button>Post Message</button>
      </form>

      <div>
        {messages.map((message) => (
          <div className="message-container" key={message.id}>
            {editingMessageId === message.id ? (
              <input
                type="text"
                value={message.text}
                onChange={(e) =>
                  setMessages((prevMessages) =>
                    prevMessages.map((prevMessage) =>
                      prevMessage.id === message.id
                        ? { ...prevMessage, text: e.target.value }
                        : prevMessage
                    )
                  )
                }
              />
            ) : (
              message.text
            )}
            {editingMessageId === message.id ? (
              <button onClick={() => handleEdit(message.id, message.text)}>
                Save
              </button>
            ) : (
              <button
                id="edit-button"
                onClick={() => setEditingMessageId(message.id)}
              >
                ✏️
              </button>
            )}
            <div id="lower-buttons">
              <button>↩️</button>
              <button onClick={() => handleLikes(message)}>
                👍{message.likes}
              </button>
              <button onClick={() => handleDelete(message.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
