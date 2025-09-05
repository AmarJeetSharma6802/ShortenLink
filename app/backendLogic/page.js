"use client";
import { useState } from "react";

export default function AuthForm() {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body = { action: mode, email };
    if (mode === "register") {
      body = { action: "register", name, email, password };
    } else if (mode === "login") {
      body = { action: "login", email, password };
    } else if (mode === "forgot") {
      body = { action: "forgot", email };
    }

    try {
      const res = await fetch("http://localhost:5000/production/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message || "Done");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div style={{ width: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px",height:"auto" }}>
      <h2 style={{ textAlign: "center" }}>
        {mode === "login" && "Login"}
        {mode === "register" && "Register"}
        {mode === "forgot" && "Forgot Password"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        
        {mode === "register" && (
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {(mode === "login" || mode === "register") && (
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <button type="submit" style={{ padding: "10px", background: "blue", color: "white", border: "none", borderRadius: "4px" }}>
          {mode === "login" && "Login"}
          {mode === "register" && "Register"}
          {mode === "forgot" && "Send Reset Link"}
        </button>
      </form>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        {mode !== "login" && (
          <p style={{ color: "blue", cursor: "pointer" }} onClick={() => setMode("login")}>
            Back to Login
          </p>
        )}

        {mode === "login" && (
          <>
            <p style={{ color: "blue", cursor: "pointer" }} onClick={() => setMode("register")}>
              Create an Account
            </p>
            <p style={{ color: "blue", cursor: "pointer" }} onClick={() => setMode("forgot")}>
              Forgot Password?
            </p>
          </>
        )}
      </div>

      {message && <p style={{ marginTop: "10px", color: "red", textAlign: "center" }}>{message}</p>}
    </div>
  );
}
