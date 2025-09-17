"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

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
    if (!letter) {
      return;
    }

    const normalizedLetter = letter.toUpperCase();

    if (gameState !== "playing" || !/^[A-Z]$/.test(normalizedLetter)) {
      return;
    }

    if (guessedLetters.has(normalizedLetter)) {
      return;
    }

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
    <section style={{ border: "1px solid #ccc", padding: "16px", backgroundColor: "#fff" }}>
      <h2 style={{ marginBottom: "12px" }}>Jogo da Forca</h2>

      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <pre style={{ fontFamily: "monospace", display: "inline-block" }}>
          {renderHangman()}
        </pre>
        <p>Tentativas restantes: {maxWrongGuesses - wrongGuesses}</p>
      </div>

      <p style={{ fontSize: "20px", letterSpacing: "4px", textAlign: "center" }}>
        {displayWord()}
      </p>

      {gameState === "playing" && (
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="guess" style={{ display: "block", marginBottom: "4px" }}>
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
              style={{ flex: 1, padding: "6px", border: "1px solid #888" }}
            />
            <button
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
        <p style={{ marginBottom: "6px" }}>Teclado virtual:</p>
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
                  border: "1px solid #888",
                  backgroundColor: alreadyGuessed ? (isCorrect ? "#c7f5c4" : "#f7c4c4") : "#f2f2f2"
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <p style={{ marginBottom: "6px" }}>Letras tentadas:</p>
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

      <button type="button" onClick={initializeGame}>
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
          background: "#16162cff"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 760,
            background: "white",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0, 68, 255, 0.08)",
            padding: 24,
            display: "grid",
            gap: 16
          }}
        >
          <button type="button" onClick={() => setView("portfolio")} style={{ justifySelf: "start" }}>
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
        background: "#16162cff"
      }}
    >
      <section
        style={{
          maxWidth: 640,
          width: "100%",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 68, 255, 0.08)",
          padding: 24,
          display: "grid",
          gap: 16,
          textAlign: "center"
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

        <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2, color: "#20204dff" }}>
          Kristyson Silva
        </h1>
        <p style={{ margin: 0 }}>Recife, Pernambuco</p>
        <p style={{ margin: 0 }}>Estudante de Ciência da Computação na UNICAP</p>

        <button type="button" onClick={() => setView("hangman")}>
          Abrir jogo da forca
        </button>

        <div style={{ textAlign: "left", display: "grid", gap: 12 }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Perfil</h2>
            <p style={{ margin: 0 }}>
              Formado em Técnico em Informática pelo SENAI Areias, com experiência em redes, suporte e desenvolvimento mobile
              com Kotlin. Hoje curso Ciência da Computação na UNICAP e reforço a base em algoritmos, estruturas de dados e
              desenvolvimento web.
            </p>
          </div>

          <div>
            <h2 style={{ marginBottom: 4 }}>Objetivo</h2>
            <p style={{ margin: 0 }}>
              Atuar como desenvolvedor front-end, contribuindo com produtos digitais, documentação simples e suporte à
              equipe, enquanto continuo aprendendo novas tecnologias.
            </p>
          </div>

          <div>
            <h2 style={{ marginBottom: 4 }}>Experiência</h2>
            <p style={{ margin: 0 }}>
              <strong>SENAI Santo Amaro – Estagiário</strong> (abr/2024 – atual): apoio ao sistema interno, ajustes de telas e
              testes.
            </p>
            <p style={{ margin: "8px 0 0 0" }}>
              <strong>Projeto Integrador SENAI</strong> (2022 – 2023): desenvolvimento de aplicativo em Kotlin, documentação e
              integração com APIs.
            </p>
          </div>

          <div>
            <h2 style={{ marginBottom: 4 }}>Formação</h2>
            <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
              <li>UNICAP – Ciência da Computação (4º período)</li>
              <li>SENAI Areias – Técnico em Informática (2023)</li>
              <li>EREM Clotilde B. Leal – Ensino Médio (2022)</li>
            </ul>
          </div>

          <div>
            <h2 style={{ marginBottom: 4 }}>Contato</h2>
            <ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 4 }}>
              <li>Telefone: (55) 81 99400-4450</li>
              <li>Email: <a href="mailto:kristyson.alpino@gmail.com">kristyson.alpino@gmail.com</a></li>
              <li>
                LinkedIn: <a href="https://www.linkedin.com/in/kristyson-alpino/">linkedin.com/in/kristyson-alpino/</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
