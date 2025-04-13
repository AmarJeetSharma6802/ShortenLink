"use client";

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/Controllers/register", {
                name: form.name,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword
            });

            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
                alert("Registration successful!");
                router.push("/dashboard");
            } else {
                alert("Registration failed");
            }

            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

        } catch (error) {
            // console.error("Registration Error:", error);
            if (error.response && error.response.data) {
                alert(error.response.data.message || error.response.data.Message);
            } else {
                alert("Something went wrong!");
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Username:</label><br />
                <input type="text" id="name" name="name" required value={form.name} onChange={handleForm} /><br />

                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" required value={form.email} onChange={handleForm} /><br />

                <label htmlFor="password">Password:</label><br />
                <input type={isVisible ? "text" : "password"} id="password" name="password" required value={form.password} onChange={handleForm} /><br />

                <label htmlFor="confirmPassword">Confirm Password:</label><br />
                <input type={isVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" required value={form.confirmPassword} onChange={handleForm} /><br />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Page;
