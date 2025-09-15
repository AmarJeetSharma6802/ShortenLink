"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

function Login() {
    const router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/Controllers/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.accessToken) {
                sessionStorage.setItem("accessToken", data.accessToken);
                alert(data.message);
                router.push("/dashboard");
            } else {
                alert("Login failed");
            }

            setForm({ email: "", password: "" });

        } catch (error) {
            alert(error.message || "Something went wrong!");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label><br />
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleForm}
                /><br />

                <label htmlFor="password">Password:</label><br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleForm}
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Login;
