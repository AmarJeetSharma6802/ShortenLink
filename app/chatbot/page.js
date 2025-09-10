"use client";
import { useState } from "react";
import styles from "../style/chat.module.css";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hello! I am your Web Ads Fusion assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "⚠️ Something went wrong!" }]);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>💬 Web Ads Fusion Chatbot</h1>

      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? styles.userMsg : styles.botMsg}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.inputBox}>
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
