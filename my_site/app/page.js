"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const COLORS = {
  text: "#000000",         // textos
  heading: "#0b1a44",      // títulos: azul bem escuro
  cardBg: "#ffffff",
  appBg: "#16162cff",
  border: "#cccccc",
  mutedBorder: "#888888",
};

const HANGMAN_WORDS = [
  "SENAI",
  "UNICAP",
  "PYTHON",
  "KOTLIN",
  "REACT",
  "JAVASCRIPT",
  "FRONTEND",
  "DESENVOLVEDOR",
  "ALGORITMO",
  "ESTAGIO",
  "APRENDIZADO",
  "DOCUMENTACAO",
  "EQUIPE",
  "TECNOLOGIA",
  "SUPORTE",
  "PROTOTIPO",
  "PROJETO",
  "MOBILE",
  "WEB",
  "API",
  "BANCO",
  "DADOS",
  "INTEGRACAO",
  "APLICATIVO",
  "USABILIDADE",
  "COTIDIANO",
  "LOGICA",
  "COMUNICACAO",
  "RESPONSABILIDADE",
  "ORGANIZACAO",
  "INFORMATICA",
  "RELATORIO",
  "SERVICOS",
  "AUTONOMIA",
  "CRONOGRAMA",
  "PLANEJAMENTO"
];

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

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleGuess = (letter) => {
    if (!letter) return;

    const normalizedLetter = letter.toUpperCase();

    if (gameState !== "playing" || !/^[A-Z]$/.test(normalizedLetter)) return;
    if (guessedLetters.has(normalizedLetter)) return;

    const updatedGuessedLetters = new Set(guessedLetters);
    updatedGuessedLetters.add(normalizedLetter);
    setGuessedLetters(updatedGuessedLetters);

    if (!currentWord.includes(normalizedLetter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);

      if (newWrongGuesses >= maxWrongGuesses) {
        setGameState("lost");
      }
    } else {
      const wordComplete = currentWord
        .split("")
        .every((char) => updatedGuessedLetters.has(char));

      if (wordComplete) {
        setGameState("won");
      }
    }
  };

  const displayWord = () =>
    currentWord
      .split("")
      .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
      .join(" ");

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
    <section
      style={{
        border: `1px solid ${COLORS.border}`,
        padding: "16px",
        backgroundColor: COLORS.cardBg,
        color: COLORS.text,
      }}
    >
      <h2 style={{ marginBottom: "12px", color: COLORS.heading }}>Jogo da Forca</h2>

      <div style={{ textAlign: "center", marginBottom: "12px", color: COLORS.text }}>
        <pre style={{ fontFamily: "monospace", display: "inline-block", color: COLORS.text }}>
          {renderHangman()}
        </pre>
        <p style={{ color: COLORS.text }}>
          Tentativas restantes: {maxWrongGuesses - wrongGuesses}
        </p>
      </div>

      <p
        style={{
          fontSize: "20px",
          letterSpacing: "4px",
          textAlign: "center",
          color: COLORS.text,
        }}
      >
        {displayWord()}
      </p>

      {gameState === "playing" && (
        <div style={{ marginBottom: "16px", color: COLORS.text }}>
          <label
            htmlFor="guess"
            style={{ display: "block", marginBottom: "4px", color: COLORS.text }}
          >
            Digite uma letra:
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              id="guess"
              type="text"
              value={inputLetter}
              onChange={(event) => setInputLetter(event.target.value.toUpperCase())}
              onKeyDown={(event) => {
                if (event.key === "Enter" && inputLetter.length === 1) {
                  handleGuess(inputLetter);
                  setInputLetter("");
                }
              }}
              maxLength={1}
              style={{
                flex: 1,
                padding: "6px",
                border: `1px solid ${COLORS.mutedBorder}`,
                color: COLORS.text,
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (inputLetter.length === 1) {
                  handleGuess(inputLetter);
                  setInputLetter("");
                }
              }}
              style={{ color: COLORS.text }}
            >
              Tentar
            </button>
          </div>
        </div>
      )}

      {gameState === "won" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Parabéns! Você descobriu a palavra {currentWord}.
        </p>
      )}

      {gameState === "lost" && (
        <p style={{ color: "#b00020", fontWeight: "bold" }}>
          Suas tentativas acabaram. A palavra era {currentWord}.
        </p>
      )}

      <div style={{ marginBottom: "16px" }}>
        <p style={{ marginBottom: "6px", color: COLORS.text }}>Teclado virtual:</p>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {alphabet.map((letter) => {
            const alreadyGuessed = guessedLetters.has(letter);
            const isCorrect = currentWord.includes(letter);

            return (
              <button
                key={letter}
                type="button"
                onClick={() => handleGuess(letter)}
                disabled={alreadyGuessed}
                style={{
                  margin: "2px",
                  padding: "6px 8px",
                  border: `1px solid ${COLORS.mutedBorder}`,
                  backgroundColor: alreadyGuessed
                    ? isCorrect
                      ? "#c7f5c4"
                      : "#f7c4c4"
                    : "#f2f2f2",
                  color: COLORS.text,
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "16px", color: COLORS.text }}>
        <p style={{ marginBottom: "6px", color: COLORS.text }}>Letras tentadas:</p>
        <div>
          {Array.from(guessedLetters).map((letter) => {
            const isCorrect = currentWord.includes(letter);

            return (
              <span
                key={letter}
                style={{
                  marginRight: "8px",
                  color: isCorrect ? "green" : "#b00020",
                  fontWeight: "bold"
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>

      <button type="button" onClick={initializeGame} style={{ color: COLORS.text }}>
        Reiniciar jogo
      </button>
    </section>
  );
};

export default function Home() {
  const [view, setView] = useState("portfolio");

  if (view === "hangman") {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: COLORS.appBg
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            background: COLORS.cardBg,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0, 68, 255, 0.08)",
            padding: 24,
            display: "grid",
            gap: 16,
            color: COLORS.text,
          }}
        >
          <button
            type="button"
            onClick={() => setView("portfolio")}
            style={{ justifySelf: "start", color: COLORS.text }}
          >
            Voltar para o currículo
          </button>
          <HangmanGame />
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: COLORS.appBg
      }}
    >
      <section
        style={{
          maxWidth: 640,
          width: "100%",
          background: COLORS.cardBg,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 68, 255, 0.08)",
          padding: 24,
          display: "grid",
          gap: 16,
          textAlign: "center",
          color: COLORS.text,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src="/img.webp"
            alt="Foto de Kristyson Silva"
            width={160}
            height={160}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            priority
          />
        </div>

        <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2, color: COLORS.heading }}>
          Kristyson Silva
        </h1>
        <p style={{ margin: 0, color: COLORS.text }}>Recife, Pernambuco</p>
        <p style={{ margin: 0, color: COLORS.text }}>Estudante de Ciência da Computação na UNICAP</p>

        <button type="button" onClick={() => setView("hangman")} style={{ color: COLORS.text }}>
          Abrir jogo da forca
        </button>

        <div style={{ textAlign: "left", display: "grid", gap: 12, color: COLORS.text }}>
          <div>
            <h2 style={{ marginBottom: 4, color: COLORS.heading }}>Perfil</h2>
            <p style={{ margin: 0, color: COLORS.text }}>
              Formado em Técnico em Informática pelo SENAI Areias, com experiência em redes, suporte e
              desenvolvimento mobile com Kotlin. Hoje curso Ciência da Computação na UNICAP e reforço a
              base em algoritmos, estruturas de dados e desenvolvimento de sistemas.
            </p>
          </div>

          <div>
            <h2 style={{ marginBottom: 4, color: COLORS.heading }}>Objetivo</h2>
            <p style={{ margin: 0, color: COLORS.text }}>
              Atuar em projetos de tecnologia e inovação, contribuindo com soluções digitais, desenvolvimento de software e 
estratégias de transformação digital. Busco desafios que me permitam aplicar meu conhecimento em tecnologia, 
aprender com profissionais experientes e gerar valor real para os clientes.
            </p>
          </div>

          <div>
            <h2 style={{ marginBottom: 4, color: COLORS.heading }}>Experiência</h2>
            <p style={{ margin: 0, color: COLORS.text }}>
              <strong style={{ color: COLORS.text }}>
                Instrutor de Educação - SENAI PE
              </strong>{" "}
              (abr/2024 – atual): Responsável por capacitar alunos para a WorldSkills na área de desenvolvimento mobile.(Android).  
            </p>
            <p style={{ margin: "8px 0 0 0", color: COLORS.text }}>
              <strong style={{ color: COLORS.text }}>Competidor da WorldSkills - SENAI PE</strong> (2022 – 2023):
              Desenvolvimento de aplicativo móveis em Kotlin, documentação e integração com APIs.
            </p>
            <p style={{ margin: "8px 0 0 0", color: COLORS.text }}>
              <strong style={{ color: COLORS.text }}>Estagiário em Informática - Nassau Tecnológia</strong> (2022 – 2023):
              Suporte operacional nos sistemas Windows e linux, geralmente via any desk ou presencialmente.
              Montagem e manutenção de Hardwares para computadores além de gerenciamento de redes para comunicação.
            </p>
          </div>

          <div>
            <h2 style={{ marginBottom: 4, color: COLORS.heading }}>Formação</h2>
            <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4, color: COLORS.text }}>
              <li>UNICAP – Ciência da Computação (4º período)</li>
              <li>SENAI – Técnico em Informática (2022)</li>
              <li>CPM Colégio da polícia militar – Ensino Médio (2020)</li>
            </ul>
          </div>

          <div>
            <h2 style={{ marginBottom: 4, color: COLORS.heading }}>Contato</h2>
            <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4, color: COLORS.text }}>
              <li>Telefone: (55) 81 994504501</li>
              <li>
                Email:{" "}
                <a href="mailto:kristyson.business@gmail.com" style={{ color: COLORS.text }}>
                  kristyson.business@gmail.com
                </a>
              </li>
              <li>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/kristyson-alpino/"
                  style={{ color: COLORS.text }}
                >
                  linkedin.com/in/kristyson-alpino/
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
