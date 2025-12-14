"use client"
import React,{useState,useEffect,useRef} from 'react'
import * as faceapi from "face-api.js";

function page() {
    const videoRef = useRef(null);
     const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadModels() {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setReady(true);
    }
    loadModels();

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  const loginFace = async () => {
    if (!ready) return alert("Models loading...");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");

    const img = await faceapi.fetchImage(dataUrl);

    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

      console.log("detec",detection)
    

    if (!detection) return alert("No face detected");

    const descriptor = Array.from(detection.descriptor);

    const res = await fetch("http://localhost:5000/job/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, descriptor }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
    console.log(data)
  };
  

  return (
     <div style={{ padding: 20 }}>
      <h2>Face Login</h2>

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

      <video ref={videoRef} autoPlay muted width={320} height={240} />

      <button onClick={loginFace}>Login with Face</button>
    </div>
  )
}

export default page