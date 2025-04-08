import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './Navbar/page.js'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shorten URL",
  description: "Generate a short URL for your long URL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
         <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/5229/5229345.png" type="image/x-icon" />
         <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/5229/5229345.png" type="image/x-icon" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Navbar/>
        {children}
      </body>
    </html>
  );
}
