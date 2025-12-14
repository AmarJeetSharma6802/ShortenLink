"use client";


import React, { useState,useRef,useEffect } from 'react'
import * as faceapi from "face-api.js";


function page() {

    const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    faceDescriptor:""
})
  const videoRef = useRef(null);
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
},[])



const handleChange =(e)=>{
    setForm({...form,[e.target.name]:e.target.value})
}

const registerUser =async()=>{
    if (!ready) return alert("Models loading...");
        if (!videoRef.current) return alert("Video not ready");

 const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

       const img = await faceapi.fetchImage(dataUrl);

    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

       if (!detection) return alert("Face not detected");

        const descriptor = Array.from(detection.descriptor);

        const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

     const formData = new FormData();
    formData.append("image", file);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("faceDescriptor", JSON.stringify(descriptor));

    const res = await fetch("http://localhost:5000/job/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    alert(data.message);
}
  return (
    <div>
        <h2>Register with Face</h2> <br></br>

        <input name='name' value={form.name} onChange={handleChange}  placeholder="Name"/>
        <input type="email" name='email' value={form.email} onChange={handleChange}  placeholder="Name"/>
        <input type='password' name='password' value={form.password} onChange={handleChange}  placeholder="Name"/>

        <video ref={videoRef} autoPlay muted width={320} height={240} />

      <button onClick={registerUser}>Capture & Register</button>
    </div>
  )
}

export default page