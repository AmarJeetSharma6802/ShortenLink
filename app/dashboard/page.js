"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
    const [token, setToken] = useState(null);
    const [dt, setDt] = useState(null); 
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        setToken(accessToken);

        const getData = async () => {
            try {
                const res = await fetch("/api/Controllers/logoutAndGetData", {
                    next: { revalidate: 60 },
                });

                const data = await res.json();
                // console.log("Fetched data:", data);

                setDt(data); 
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        getData();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setToken(null);
        router.push("/fronted/login");
    };

    return (
        <>
            <h1>Dashboard</h1>

            <button onClick={() => router.push("/fronted/login")}>Login</button>

            {token ? (
                <>
                    <h2>You are logged in</h2>
                    {dt ? (
                        <div>
                            <p><strong>Name:</strong> {dt.name}</p>
                            <p><strong>Email:</strong> {dt.email}</p>
                            {/* <p><strong>Created:</strong> {new Date(dt.createdAt).toLocaleString()}</p> */}
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <h2>You are logged out</h2>
            )}
        </>
    );
}

export default Page;
