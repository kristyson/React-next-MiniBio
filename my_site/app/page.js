"use client";
import Image from "next/image";
import { useState } from "react";


export default function Home() {

  const [fotoAtual, setFotoAtual] = useState("/img.webp");

  const trocarFoto = () => {
    setFotoAtual((prev) =>
      prev === "/img.webp" ? "/kris.webp" : "/img.webp"
    );
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "#16162cff"
    }}>
      <section style={{
        maxWidth: 640,
        width: "100%",
        background: "white",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0, 68, 255, 0.08)",
        padding: 24,
        display: "grid",
        gap: 16,
        textAlign: "center"
      }}>
        <div style={{ justifyItemsustifyContent: "center" }}>
          <Image
            src={fotoAtual}
            width={160}
            height={160}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            priority
            onClick={trocarFoto} 
          />
        </div>

        <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2, color: "#20204dff"  }}>
          KRIS ALPINO
        </h1>

        <p style={{ margin: 0, fontSize: 18, color: "#555" }}>
          Iae tudo bem ?! Esse foi meu primeiro site !!👽 <br/>
          Interessante, mas é mais divertido criar aplicativos do que sites 😁
        </p>
      </section>
    </main>
  );
}
