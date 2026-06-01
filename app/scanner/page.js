"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const READER_ID = "ticket-qr-reader";

export default function ScannerPage() {
  const scannerRef = useRef(null);
  const isVerifyingRef = useRef(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("Camera starting...");
  const [lastError, setLastError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const getTokenFromQr = (decodedText) => {
    const qrText = String(decodedText || "").trim();

    if (!qrText) return "";

    try {
      const url = new URL(qrText);
      return (
        url.searchParams.get("token") ||
        url.pathname.split("/").filter(Boolean).pop() ||
        ""
      );
    } catch {
      return qrText;
    }
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Scanner may already be stopped.
    }
  };

  const verifyTicket = async (decodedText) => {
    if (isVerifyingRef.current) return;

    const token = getTokenFromQr(decodedText);

    if (!token) {
      setResult({ status: "Invalid QR" });
      setMessage("QR mila, lekin token nahi mila.");
      return;
    }

    isVerifyingRef.current = true;
    setIsScanning(false);
    setLastError("");
    setMessage("Ticket verify ho raha hai...");
    await stopScanner();

    try {
      const res = await fetch(
        `/api/tickets/verify-ticket?token=${encodeURIComponent(token)}`
      );
      const data = await res.json();
      setResult(data);
      setMessage(res.ok ? "Scan complete" : "Ticket verify nahi hua");
    } catch {
      setResult({ status: "Network Error" });
      setMessage("Server se connect nahi ho paya.");
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const startScanner = async () => {
    setResult(null);
    setLastError("");
    setMessage("Camera start ho raha hai...");

    try {
      await stopScanner();

      const scanner = scannerRef.current || new Html5Qrcode(READER_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();
      const backCamera =
        cameras.find((camera) => /back|rear|environment/i.test(camera.label)) ||
        cameras[cameras.length - 1] ||
        cameras[0];

      if (!backCamera) {
        setMessage("Camera nahi mila.");
        return;
      }

      await scanner.start(
        backCamera.id,
        {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const size = Math.floor(minEdge * 0.82);
            return { width: size, height: size };
          },
          aspectRatio: 1.333,
          disableFlip: false,
        },
        verifyTicket,
        (errorMessage) => {
          if (errorMessage && !String(errorMessage).includes("NotFoundException")) {
            setLastError(String(errorMessage));
          }
        }
      );

      setIsScanning(true);
      setMessage("QR ko camera ke center me clear rakho.");
    } catch (error) {
      setIsScanning(false);
      setMessage("Camera start nahi hua. Browser me camera permission allow karo.");
      setLastError(String(error?.message || error || ""));
    }
  };

  const scanImageFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult(null);
    setLastError("");
    setMessage("Image scan ho rahi hai...");

    try {
      const scanner = scannerRef.current || new Html5Qrcode(READER_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = scanner;

      await stopScanner();
      const decodedText = await scanner.scanFile(file, false);
      await verifyTicket(decodedText);
    } catch (error) {
      setResult({ status: "QR Not Found" });
      setMessage("Is image me QR read nahi ho pa raha.");
      setLastError(String(error?.message || error || ""));
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner().finally(() => {
        try {
          scannerRef.current?.clear();
        } catch {
          // Ignore cleanup errors.
        }
      });
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Ticket Scanner</h1>

      <div
        id={READER_ID}
        style={{
          width: "460px",
          maxWidth: "100%",
          margin: "0 auto",
          border: "2px solid #111",
          background: "#fff",
        }}
      />

      <p style={{ marginTop: "12px" }}>{message}</p>
      {lastError && (
        <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
          {lastError}
        </p>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={startScanner} disabled={isScanning}>
          Scan Again
        </button>
        <label>
          Scan From Photo
          <input
            type="file"
            accept="image/*"
            onChange={scanImageFile}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {result && (
        <div
          style={{
            margin: "20px auto 0",
            maxWidth: "420px",
            padding: "10px",
            border: "2px solid",
            borderColor: result.status === "Entry Allowed" ? "green" : "red",
          }}
        >
          <h2>{result.status}</h2>
          {result.name && <p><b>Name:</b> {result.name}</p>}
          {result.event && <p><b>Event:</b> {result.event}</p>}
          {result.tickets && <p><b>Tickets:</b> {result.tickets}</p>}
        </div>
      )}
    </div>
  );
}
