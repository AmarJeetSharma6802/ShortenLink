"use client";
import { useState } from "react";

export default function AuthForm() {
  const [isForget, setIsForget] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = isForget
      ? { email, action: "forget" }
      : { email, password, action: "login" };

    try {
      const res = await fetch("/api/Controllers/login", {
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

  const handleForget =()=>{
    setIsForget((prev) => !prev)
  }

  return (
    <div className="auth-container">
      <h2>{isForget ? "Forgot Password" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!isForget && (
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <button type="submit">
          {isForget ? "Send Reset Link" : "Login"}
        </button>
      </form>

      <p className="toggle-text" onClick={handleForget}>
        {isForget ? "Back to Login" : "Forgot Password?"}
      </p>

      {message && <p className="message">{message}</p>}
    </div>
  );
}