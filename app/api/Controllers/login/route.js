import userForm from "../../model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "../../utils/db.connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "../../utils/nodemailer.js";

const failedLoginAttempts = new Map();

export async function POST(req) {
  await DBconnect();

  const { email, password, action } = await req.json();

  if (action === "forget") {
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await userForm.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
             <p>Link expires in 15 min</p>
              <p>Or use this code: <strong>${resetToken}</strong></p>,
             `,
      });
    } catch (err) {
      console.error("Reset email not sent:", err);
      return res
        .status(500)
        .json({ message: "Reset password email could not be sent" });
    }

    return NextResponse.json(
      { message: "Password reset link sent to your email." },
      { status: 200 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("remote-addr") ||
    req.socket?.remoteAddress ||
    "unknown";

  const loginAttempt = failedLoginAttempts.get(ip);

  if (loginAttempt?.blockedUntil && Date.now() < loginAttempt.blockedUntil) {
    // const remainingTime = Math.ceil((loginAttempt.blockedUntil - Date.now()) / 1000);  // seconds me show karne keliye
    const remainingTime = Math.ceil(
      (loginAttempt.blockedUntil - Date.now()) / (1000 * 60)
    ); // minutes me show karne keliye
    return NextResponse.json(
      {
        message: `Too many failed attempts. Try again in ${remainingTime} min.`,
      },
      { status: 429 }
    );
  }

  if (!email || !password) {
    return new NextResponse(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  const user = await userForm.findOne({ email });

  if (!user) {
    return handleFailedAttempt(ip);
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return handleFailedAttempt(ip);
  }

  // ✅ Clear attempts on success
  failedLoginAttempts.delete(ip);

  const accessToken = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.JWTSECRETKEY,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.REFRESH_JWTSECRETKEY,
    { expiresIn: "5d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  const response = NextResponse.json(
    {
      message: "Login successful",
      user: { name: user.name, email: user.email },
      accessToken,
      refreshToken,
    },
    { status: 200 }
  );

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return response;
}

// ✅ Helper for handling failed login
function handleFailedAttempt(ip) {
  const currentTime = Date.now();
  const attempt = failedLoginAttempts.get(ip) || {
    attempts: 0,
    lastAttempt: null,
  };

  attempt.attempts += 1;
  attempt.lastAttempt = currentTime; //abhi ka time store karo

  if (attempt.attempts >= 5) {
    attempt.blockedUntil = currentTime + 15 * 60 * 1000; // 15 minutes
  }

  // Yeh dono values us object me set ho rahi hain jo IP ke saath linked hai
  failedLoginAttempts.set(ip, attempt);

  return NextResponse.json(
    { message: "Invalid credentials or user not found." },
    { status: 401 }
  );
}
