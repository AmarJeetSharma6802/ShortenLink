"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const storageKey = (email) => `ticket:${email}`;

export default function TicketPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setError("");

      const res = await fetch(`/api/tickets/view-ticket?token=${encodeURIComponent(token)}`);
      const result = await res.json();

      if (!res.ok) {
        setData(null);
        setError(result.error || "Ticket not found");
        return;
      }

      const ticketData = {
        name: result.name,
        email: result.email,
        event: result.event,
        tickets: result.tickets,
        org: result.org,
        token: result.token,
        qr: result.qr,
        isUsed: result.isUsed,
      };

      localStorage.setItem(storageKey(result.email), JSON.stringify(ticketData));
      localStorage.setItem("currentTicketEmail", result.email);
      setData(ticketData);
    };

    fetchData();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ticket Details</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div
          style={{
            display: "grid",
            gap: "16px",
            maxWidth: "520px",
          }}
        >
          <h2>{data.isUsed ? "Already Used" : "Valid Ticket"}</h2>
          {data.qr && (
            <img
              src={data.qr}
              alt="Ticket QR Code"
              width="340"
              height="340"
              style={{
                border: "2px solid #111",
                padding: "14px",
                background: "#fff",
                maxWidth: "100%",
                width: "340px",
                height: "340px",
              }}
            />
          )}
          <div>
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
            <p>Event: {data.event}</p>
            <p>Tickets: {data.tickets}</p>
            <p>Organizer: {data.org}</p>
          </div>
          <a download href={`/api/tickets/download-ticket?token=${encodeURIComponent(data.token)}`}>
            Download Ticket
          </a>
        </div>
      )}
    </div>
  );
}
