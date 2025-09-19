"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const COLORS = {
  text: "#000000",      // textos
  heading: "#0b1a44",   // títulos (azul bem escuro)
  cardBg: "#ffffff",
  appBg: "#16162cff",
  border: "#e6e8ec",
  mutedBorder: "#c9cdd5",
  primary: "#0b1a44",
  primaryHover: "#132a6b",
  soft: "#f5f7fb",
};

const HANGMAN_WORDS = [
  "SENAI","UNICAP","PYTHON","KOTLIN","REACT","JAVASCRIPT","FRONTEND","DESENVOLVEDOR",
  "ALGORITMO","ESTAGIO","APRENDIZADO","DOCUMENTACAO","EQUIPE","TECNOLOGIA","SUPORTE",
  "PROTOTIPO","PROJETO","MOBILE","WEB","API","BANCO","DADOS","INTEGRACAO","APLICATIVO",
  "USABILIDADE","COTIDIANO","LOGICA","COMUNICACAO","RESPONSABILIDADE","ORGANIZACAO",
  "INFORMATICA","RELATORIO","SERVICOS","AUTONOMIA","CRONOGRAMA","PLANEJAMENTO"
];

const GlobalStyles = () => (
  <style jsx global>{`

 /* garante contraste no grupo */
  .kbd{ color: var(--text); }

  /* tecla padrão */
  .key{
    min-width:36px; height:36px;
    display:inline-flex; align-items:center; justify-content:center;
    border:1px solid #b8c2d8;            /* borda mais visível */
    border-radius:10px;
    background:#eef2f9;                   /* leve azul */
    font-weight:700;
    color: var(--heading) !important;     /* texto azul escuro */
    cursor:pointer;
    transition: background .15s ease, transform .06s ease, border-color .2s ease;
  }
  .key:hover{ background:#e3e9f6; }

  /* já clicadas e corretas */
  .key.correct{
    background:#e8f9eb;
    border-color:#86d39a;
    color:#14532d !important;             /* verde escuro */
  }

  /* já clicadas e erradas */
  .key.wrong{
    background:#fde8e8;
    border-color:#f1a7a7;
    color:#7f1d1d !important;             /* vermelho escuro */
  }

  /* não reduza contraste quando estiver desabilitada */
  .key:disabled{ opacity:1; cursor:not-allowed; }

    :root{
      --text:${COLORS.text};
      --heading:${COLORS.heading};
      --bg:${COLORS.appBg};
      --card:${COLORS.cardBg};
      --border:${COLORS.border};
      --muted-border:${COLORS.mutedBorder};
      --primary:${COLORS.primary};
      --primary-hover:${COLORS.primaryHover};
      --soft:${COLORS.soft};
      --radius:16px;
      --shadow:0 12px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04);
      --shadow-hover:0 16px 40px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.06);
    }
    *,*::before,*::after{ box-sizing:border-box; }
    html,body{ height:100%; }
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color:var(--text);
      background:
        radial-gradient(1200px 500px at 10% -10%, rgba(255,255,255,0.08), transparent 40%),
        radial-gradient(1200px 600px at 110% -20%, rgba(255,255,255,0.06), transparent 45%),
        var(--bg);
    }
    h1,h2,h3{ color:var(--heading); margin:0 0 8px; line-height:1.2; }
    p,li{ color:var(--text); }
    .app{
      min-height:100vh; display:flex; align-items:center; justify-content:center; padding:32px;
    }
    .shell{ width:100%; max-width:760px; }
    .card{
      background:var(--card);
      border:1px solid var(--border);
      border-radius:var(--radius);
      box-shadow:var(--shadow);
      padding:28px;
      transition:box-shadow .25s ease, transform .25s ease;
    }
    .card:hover{ box-shadow:var(--shadow-hover); transform: translateY(-1px); }

    .header{
      display:grid; gap:12px; justify-items:center; text-align:center;
    }
    .avatar{
      width:160px; height:160px; border-radius:50%; overflow:hidden;
      border:3px solid var(--soft);
      box-shadow:0 8px 22px rgba(0,0,0,0.12);
      transition: transform .2s ease;
    }
    .avatar:hover{ transform: scale(1.02); }
    .caption{ margin:0; opacity:.85; }

    .grid{ display:grid; gap:18px; margin-top:18px; }
    .section{ padding:16px; border:1px solid var(--border); border-radius:12px; background:#fff; }
    .list{ margin:0; padding-left:18px; display:grid; gap:6px; }

    .btn{
      appearance:none; border:1px solid var(--muted-border); background:#fff; color:var(--text);
      border-radius:12px; padding:10px 14px; font-weight:600; cursor:pointer;
      transition: background .2s ease, transform .06s ease, box-shadow .2s ease, border-color .2s ease;
      box-shadow: 0 1px 0 rgba(0,0,0,0.03);
    }
    .btn:hover{ background:var(--soft); }
    .btn:active{ transform: translateY(1px); }
    .btn-primary{
      background:var(--primary); color:#fff; border-color:transparent;
    }
    .btn-primary:hover{ background:var(--primary-hover); }

    /* Hangman */
    .gamewrap{ display:grid; gap:16px; }
    .hangman{
      display:grid; gap:4px; justify-items:center; text-align:center;
      padding:12px; border-radius:12px; background: #fff;
      border:1px dashed var(--border);
    }
    .ascii{
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      white-space: pre; line-height:1.1; margin:0;
    }
    .status{ margin:6px 0 0; font-size:14px; opacity:.85; }
    .word{
      font-size:22px; letter-spacing:6px; text-align:center; margin:8px 0 0; font-weight:700;
    }
    .row{ display:flex; gap:10px; }
    .input{
      flex:1; height:42px; border:1px solid var(--muted-border); border-radius:10px; padding:0 12px;
      font-size:16px; outline:none; transition:border-color .2s ease, box-shadow .2s ease;
    }
    .input:focus{
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(11,26,68,0.12);
    }

    .kbd{
      display:flex; flex-wrap:wrap; gap:8px; justify-content:center;
      background:#fff; border:1px solid var(--border); border-radius:12px; padding:12px;
    }
    .key{
      min-width:36px; height:36px; display:inline-flex; align-items:center; justify-content:center;
      border:1px solid var(--muted-border); border-radius:10px; background:#f7f8fb;
      font-weight:700; cursor:pointer; transition: background .15s ease, transform .06s ease, border-color .2s ease;
    }
    .key:hover{ background:#eef2f9; }
    .key:disabled{ cursor:not-allowed; opacity:.8; transform:none; }
    .key.correct{ background:#e8f9eb; border-color:#b7e4be; }
    .key.wrong{ background:#fde8e8; border-color:#f3b7b7; }

    .chips{ display:flex; flex-wrap:wrap; gap:8px; }
    .chip{
      padding:4px 10px; border-radius:999px; font-size:13px; border:1px solid var(--border);
      background:#fff; box-shadow:0 1px 0 rgba(0,0,0,0.02);
    }

    .footer-actions{ display:flex; gap:10px; justify-content:center; }
    .muted{ color:#1f2937; opacity:.92; }

    @media (max-width: 560px){
      .card{ padding:20px; }
      .word{ font-size:18px; letter-spacing:5px; }
      .avatar{ width:128px; height:128px; }
    }
  `}</style>
);

const HangmanGame = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [inputLetter, setInputLetter] = useState("");
  const maxWrongGuesses = 6;

  const initializeGame = useCallback(() => {
    const randomWord =
      HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameState("playing");
    setInputLetter("");
  }, []);

  useEffect(() => { initializeGame(); }, [initializeGame]);

  const handleGuess = (letter) => {
    if (!letter) return;
    const normalizedLetter = letter.toUpperCase();
    if (gameState !== "playing" || !/^[A-Z]$/.test(normalizedLetter)) return;
    if (guessedLetters.has(normalizedLetter)) return;

    const updated = new Set(guessedLetters);
    updated.add(normalizedLetter);
    setGuessedLetters(updated);

    if (!currentWord.includes(normalizedLetter)) {
      const ng = wrongGuesses + 1;
      setWrongGuesses(ng);
      if (ng >= maxWrongGuesses) setGameState("lost");
    } else {
      const complete = currentWord.split("").every((c) => updated.has(c));
      if (complete) setGameState("won");
    }
  };

  const displayWord = () =>
    currentWord.split("").map((l) => (guessedLetters.has(l) ? l : "_")).join(" ");

  const renderHangman = () => {
    const head = wrongGuesses > 0 ? "O" : " ";
    const body = wrongGuesses > 1 ? "|" : " ";
    const leftArm = wrongGuesses > 2 ? "/" : " ";
    const rightArm = wrongGuesses > 3 ? "\\" : " ";
    const leftLeg = wrongGuesses > 4 ? "/" : " ";
    const rightLeg = wrongGuesses > 5 ? "\\" : " ";
    const lines = [
      "  +---+",
      "  |   |",
      `  ${head}   |`,
      ` ${leftArm}${body}${rightArm}  |`,
      ` ${leftLeg} ${rightLeg}  |`,
      "      |",
      "======="
    ];
    return lines.join("\n");
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="gamewrap">
      <h2>Jogo da Forca</h2>

      <div className="hangman" aria-live="polite">
        <pre className="ascii">{renderHangman()}</pre>
        <p className="status">Tentativas restantes: {maxWrongGuesses - wrongGuesses}</p>
      </div>

      <p className="word" aria-label="Palavra em progresso">{displayWord()}</p>

      {gameState === "playing" && (
        <div className="grid">
          <div>
            <label htmlFor="guess" className="muted">Digite uma letra:</label>
            <div className="row" style={{ marginTop: 8 }}>
              <input
                id="guess"
                className="input"
                type="text"
                value={inputLetter}
                onChange={(e) => setInputLetter(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputLetter.length === 1) {
                    handleGuess(inputLetter);
                    setInputLetter("");
                  }
                }}
                maxLength={1}
                placeholder="A"
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  if (inputLetter.length === 1) {
                    handleGuess(inputLetter);
                    setInputLetter("");
                  }
                }}
              >
                Tentar
              </button>
            </div>
          </div>

          <div>
            <p className="muted" style={{ marginBottom: 8 }}>Teclado virtual:</p>
            <div className="kbd">
              {alphabet.map((letter) => {
                const already = guessedLetters.has(letter);
                const correct = currentWord.includes(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleGuess(letter)}
                    disabled={already}
                    className={`key ${already ? (correct ? "correct" : "wrong") : ""}`}
                    aria-pressed={already}
                    aria-label={`Letra ${letter}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="muted" style={{ marginBottom: 8 }}>Letras tentadas:</p>
            <div className="chips">
              {Array.from(guessedLetters).map((letter) => {
                const correct = currentWord.includes(letter);
                return (
                  <span
                    key={letter}
                    className="chip"
                    style={{ borderColor: correct ? "#b7e4be" : "#f3b7b7", background: correct ? "#e8f9eb" : "#fde8e8" }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="footer-actions">
            <button type="button" className="btn" onClick={initializeGame}>
              Reiniciar jogo
            </button>
          </div>
        </div>
      )}

      {gameState === "won" && (
        <div className="section" aria-live="polite">
          <p style={{ margin: 0, fontWeight: 700, color: "#15803d" }}>
            Parabéns! Você descobriu a palavra {currentWord}.
          </p>
          <div className="footer-actions" style={{ marginTop: 10 }}>
            <button type="button" className="btn" onClick={initializeGame}>Jogar novamente</button>
          </div>
        </div>
      )}

      {gameState === "lost" && (
        <div className="section" aria-live="polite">
          <p style={{ margin: 0, fontWeight: 700, color: "#b91c1c" }}>
            Suas tentativas acabaram. A palavra era {currentWord}.
          </p>
          <div className="footer-actions" style={{ marginTop: 10 }}>
            <button type="button" className="btn" onClick={initializeGame}>Tentar outra</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [view, setView] = useState("portfolio");

  if (view === "hangman") {
    return (
      <div className="app">
        <div className="shell">
          <div className="card">
            <button type="button" className="btn" onClick={() => setView("portfolio")} style={{ marginBottom: 16 }}>
              Voltar para o currículo
            </button>
            <HangmanGame />
          </div>
        </div>
        <GlobalStyles />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="shell">
        <section className="card">
          <header className="header">
            <div className="avatar">
              <Image
                src="/img.webp"
                alt="Foto de Kristyson Silva"
                width={160}
                height={160}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                priority
              />
            </div>
            <h1>Kristyson Silva</h1>
            <p className="caption">Recife, Pernambuco • Estudante de Ciência da Computação na UNICAP</p>
            <button type="button" className="btn btn-primary" onClick={() => setView("hangman")}>
              Abrir jogo da forca
            </button>
          </header>

          <div className="grid">
            <section className="section">
              <h2>Perfil</h2>
              <p className="muted" style={{ margin: 0 }}>
                Formado em Técnico em Informática pelo SENAI Areias, com experiência em redes, suporte e
                desenvolvimento mobile com Kotlin. Hoje curso Ciência da Computação na UNICAP e reforço a
                base em algoritmos, estruturas de dados e desenvolvimento de sistemas.
              </p>
            </section>

            <section className="section">
              <h2>Objetivo</h2>
              <p className="muted" style={{ margin: 0 }}>
                Atuar em projetos de tecnologia e inovação, contribuindo com soluções digitais, desenvolvimento de software e
                estratégias de transformação digital. Busco desafios que me permitam aplicar meu conhecimento em tecnologia,
                aprender com profissionais experientes e gerar valor real para os clientes.
              </p>
            </section>

            <section className="section">
              <h2>Experiência</h2>
              <p className="muted" style={{ margin: 0 }}>
                <strong>Instrutor de Educação - SENAI PE</strong> (abr/2024 – atual): Responsável por capacitar alunos para a
                WorldSkills na área de desenvolvimento mobile (Android).
              </p>
              <p className="muted" style={{ margin: "8px 0 0 0" }}>
                <strong>Competidor da WorldSkills - SENAI PE</strong> (2022 – 2023): Desenvolvimento de aplicativos
                móveis em Kotlin, documentação e integração com APIs.
              </p>
              <p className="muted" style={{ margin: "8px 0 0 0" }}>
                <strong>Estagiário em Informática - Nassau Tecnológia</strong> (2022 – 2023): Suporte operacional em
                Windows e Linux (remoto e presencial), montagem/manutenção de hardware e gerenciamento de redes.
              </p>
            </section>

            <section className="section">
              <h2>Formação</h2>
              <ul className="list">
                <li>UNICAP – Ciência da Computação (5º período)</li>
                <li>SENAI – Técnico em Informática (2022)</li>
                <li>CPM Colégio da Polícia Militar – Ensino Médio (2020)</li>
              </ul>
            </section>

            <section className="section">
              <h2>Contato</h2>
              <ul className="list">
                <li>
                  Telefone:{" "}
                  <a href="tel:+5581994504501" style={{ color: "inherit", textDecoration: "none", borderBottom: "1px dashed var(--muted-border)" }}>
                    (55) 81 99450-4501
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a href="mailto:kristyson.business@gmail.com" style={{ color: "inherit", textDecoration: "none", borderBottom: "1px dashed var(--muted-border)" }}>
                    kristyson.business@gmail.com
                  </a>
                </li>
                <li>
                  LinkedIn:{" "}
                  <a href="https://www.linkedin.com/in/kristyson-alpino/" style={{ color: "inherit", textDecoration: "none", borderBottom: "1px dashed var(--muted-border)" }}>
                    linkedin.com/in/kristyson-alpino/
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </div>
      <GlobalStyles />
    </div>
  );
}
