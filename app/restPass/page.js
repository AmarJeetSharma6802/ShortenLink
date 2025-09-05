"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/Controllers/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Password reset successful");
    } catch (err) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {token ? (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit">Reset Password</button>
        </form>
      ) : (
        <p>Invalid or missing token.</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
