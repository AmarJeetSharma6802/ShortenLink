'use client'
import { useState } from 'react';
import style from "../page.module.css"

export default function Page() {
  const [name, setName] = useState('');

  const generate = async () => {
    const res = await fetch('/api/certificate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.png';
    a.click();
  };

  return (
    <main className={style.container}>
      <h1 className={style.h1}>Certificate Generator</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={style.input}
      />
      <button
        onClick={generate}
        className={style.btn}
      >
        Download Certificate
      </button>
    </main>
  );
}
