"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter()

  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/job/manullLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    // if (data.accessToken) {
    //   localStorage.setItem("accessToken", data.accessToken);
    // }

    alert(data.message || "Login done");

    router.push("/job")

  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handlechange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handlechange}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Page;
