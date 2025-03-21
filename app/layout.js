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
        <link rel="icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVgaeV7d7Zv9YyyRzK8RiM-KxkZW1Z5aHyMA&s" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Navbar/>
        {children}
      </body>
    </html>
  );
}
