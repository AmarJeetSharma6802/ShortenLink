// "use client";
// import { useState } from "react";

// export default function AuthForm() {
//   const [isForget, setIsForget] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const body = isForget
//       ? { email, action: "forget" }
//       : { email, password, action: "login" };

//     try {
//       const res = await fetch("/api/Controllers/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       setMessage(data.message || "Done");


//     } catch (err) {
//       console.error(err);
//       setMessage("Something went wrong!");
//     }
//   };

//   const handleForget =()=>{
//     setIsForget((prev) => !prev)
//   }

//   return (
//     <div className="auth-container">
//       <h2>{isForget ? "Forgot Password" : "Login"}</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         {!isForget && (
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         )}

//         <button type="submit">
//           {isForget ? "Send Reset Link" : "Login"}
//         </button>
//       </form>

//       <p className="toggle-text" onClick={handleForget}>
//         {isForget ? "Back to Login" : "Forgot Password?"}
//       </p>

//       {message && <p className="message">{message}</p>}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const loginRequest = async (body) => {
  const res = await fetch("/api/Controllers/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
};

export default function AuthForm() {
  const [isForget, setIsForget] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError, error, data } = useMutation({
    mutationFn: loginRequest,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = isForget
      ? { email, action: "forget" }
      : { email, password, action: "login" };

    mutate(body); 
  };

  return (
    <div className="auth-container">
      <h2>{isForget ? "Forgot Password" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {!isForget && (
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <button type="submit" disabled={isPending}>
          {isPending
            ? "Please wait..."
            : isForget
            ? "Send Reset Link"
            : "Login"}
        </button>
      </form>

      <p className="toggle-text" onClick={() => setIsForget((p) => !p)}>
        {isForget ? "Back to Login" : "Forgot Password?"}
      </p>

      {data?.message && <p className="message">{data.message}</p>}

      {isError && <p className="message error">{error.message}</p>}
    </div>
  );
}
