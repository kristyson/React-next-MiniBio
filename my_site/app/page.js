"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const HANGMAN_WORDS = [
  "SENAI",
  "UNICAP",
  "PYTHON",
  "JAVA",
  "KOTLIN",
  "CSHARP",
  "NODEJS",
  "EXPRESS",
  "REACT",
  "NATIVE",
  "SQLITE",
  "LOGICA",
  "TECNOLOGIA",
  "INOVACAO",
  "DIGITAL",
  "DESENVOLVEDOR",
  "SISTEMAS",
  "AUTOMACAO",
  "RELATORIO",
  "PROTOTIPO",
  "SUPORTE",
  "SERVICENOW",
  "PROATIVO",
  "ORGANIZADO",
  "COMUNICACAO",
  "ATENDIMENTO",
  "EQUIPE",
  "PROJETOS",
  "ESTAGIO",
  "INFORMATICA",
  "INVENTARIO",
  "ESTOQUE",
  "DASHBOARD",
  "SQUAD"
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
    const parts = [
      "   +---+",
      "   |   |",
      `   ${wrongGuesses > 0 ? "O" : " "}   |`,
      `  ${wrongGuesses > 2 ? "/" : " "}${wrongGuesses > 1 ? "|" : " "}${
        wrongGuesses > 3 ? "\\" : " "
      }  |`,
      `  ${wrongGuesses > 4 ? "/" : " "} ${wrongGuesses > 5 ? "\\" : " "}  |`,
      "       |",
      "========="
    ];

    return parts.map((line, index) => (
      <div key={index} style={{ fontFamily: "monospace" }}>
        {line}
      </div>
    ));
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div
      style={{
        maxWidth: "880px",
        margin: "0 auto",
        padding: "24px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 68, 255, 0.12)"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "24px",
          color: "#20204d",
          fontSize: "2rem"
        }}
      >
        🎯 Jogo da Forca
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px"
        }}
      >
        <div>
          <div
            style={{
              background: "#f8f9fa",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "16px",
              textAlign: "center"
            }}
          >
            {renderHangman()}
          </div>

          <div style={{ textAlign: "center", color: "#dc3545", fontSize: "14px" }}>
            Tentativas restantes: {maxWrongGuesses - wrongGuesses}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "32px",
              letterSpacing: "6px",
              textAlign: "center",
              marginBottom: "20px",
              fontWeight: "bold",
              color: "#20204d",
              fontFamily: "monospace"
            }}
          >
            {displayWord()}
          </div>

          {gameState === "playing" && (
            <>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input
                    type="text"
                    value={inputLetter}
                    onChange={(event) =>
                      setInputLetter(event.target.value.toUpperCase())
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (inputLetter.length === 1) {
                          handleGuess(inputLetter);
                          setInputLetter("");
                        }
                      }
                    }}
                    maxLength={1}
                    placeholder="Digite uma letra"
                    style={{
                      flex: 1,
                      padding: "12px",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      fontSize: "16px",
                      textAlign: "center"
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
                    style={{
                      padding: "12px 20px",
                      background: "#20204d",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  >
                    Tentar
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ marginBottom: "8px", color: "#495057" }}>
                  Teclado virtual
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                    gap: "8px"
                  }}
                >
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
                          padding: "10px 0",
                          border: "1px solid #dee2e6",
                          borderRadius: "6px",
                          background: alreadyGuessed
                            ? isCorrect
                              ? "#28a745"
                              : "#dc3545"
                            : "#f8f9fa",
                          color: alreadyGuessed ? "white" : "#495057",
                          fontWeight: "bold",
                          fontSize: "14px",
                          cursor: alreadyGuessed ? "default" : "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {gameState === "won" && (
            <div
              style={{
                background: "#d4edda",
                color: "#155724",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                marginBottom: "20px"
              }}
            >
              <h3>🎉 Parabéns! Você venceu!</h3>
              <p>
                A palavra era: <strong>{currentWord}</strong>
              </p>
            </div>
          )}

          {gameState === "lost" && (
            <div
              style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                marginBottom: "20px"
              }}
            >
              <h3>😵 Não foi dessa vez!</h3>
              <p>
                A palavra era: <strong>{currentWord}</strong>
              </p>
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ marginBottom: "8px", color: "#495057" }}>
              Letras tentadas
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {Array.from(guessedLetters).map((letter) => (
                <span
                  key={letter}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    background: currentWord.includes(letter)
                      ? "#28a745"
                      : "#dc3545",
                    color: "white",
                    letterSpacing: "1px"
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={initializeGame}
            style={{
              width: "100%",
              padding: "12px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            🔄 Novo jogo
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [view, setView] = useState("portfolio");
  const [currentPhoto, setCurrentPhoto] = useState("/img.webp");

  const togglePhoto = () => {
    setCurrentPhoto((prev) => (prev === "/img.webp" ? "/kris.webp" : "/img.webp"));
  };

  const experiences = [
    {
      role: "Estágio em Desenvolvimento de Sistemas",
      company: "SENAI Santo Amaro – PE",
      period: "Abr/2024 – Presente",
      details: [
        "Atualização e suporte contínuo das plataformas web utilizadas pelos setores internos.",
        "Criação de integrações e automações para otimizar o fluxo de dados entre equipes.",
        "Elaboração de apresentações e protótipos alinhados às necessidades dos usuários.",
        "Atendimento das demandas com foco em agilidade, documentação e qualidade." 
      ]
    },
    {
      role: "Projeto Integrador – Desenvolvedor Full Stack",
      company: "SENAI Areias – PE",
      period: "Ago/2023 – Out/2023",
      details: [
        "Levantamento de requisitos e desenho de soluções digitais ponta a ponta.",
        "Implementação de automações, manutenção preventiva e geração de relatórios técnicos.",
        "Condução de reuniões de alinhamento, testes e correções de bugs em equipe multidisciplinar."
      ]
    }
  ];

  const education = [
    {
      institution: "Universidade Católica de Pernambuco – UNICAP",
      course: "Bacharelado em Ciência da Computação",
      period: "2024 – 2028 (cursando)"
    },
    {
      institution: "SENAI Areias – PE",
      course: "Técnico em Informática",
      period: "2021 – 2023 • 1.200h"
    },
    {
      institution: "EREM Clotilde B. Leal",
      course: "Ensino Médio",
      period: "2020 – 2022"
    }
  ];

  const projects = [
    {
      title: "CheckWork",
      description:
        "Aplicativo mobile de ponto eletrônico desenvolvido com React Native e Kotlin, integrando APIs, notificações e gestão de jornada para squads internos.",
      tech: ["React Native", "Kotlin", "APIs", "Notificações"]
    },
    {
      title: "Inventory Control",
      description:
        "Sistema de controle de estoque com Node.js, Express e SQLite, com interface web para cadastro de itens, baixa automática e relatórios.",
      tech: ["Node.js", "Express", "SQLite", "Relatórios"]
    },
    {
      title: "Elevator Status",
      description:
        "Ferramenta de automação predial focada no monitoramento de elevadores e exibição de indicadores para suporte técnico. Projeto desenvolvido no SENAI Areias.",
      tech: ["Automação", "Relatórios", "Monitoramento"]
    },
    {
      title: "Automated Storage",
      description:
        "Sistema de armazenamento automatizado com acompanhamento de temperatura, dashboards e notificações, conduzido em 12 semanas no SENAI Areias.",
      tech: ["IoT", "Dashboards", "Node-RED"]
    }
  ];

  const hardSkills = [
    "Lógica de programação",
    "Python",
    "C#",
    "Java",
    "Kotlin",
    "Pacote Office",
    "Manutenção de computadores e redes",
    "Suporte técnico",
    "Service Now (tickets)",
    "Inglês – básico"
  ];

  const softSkills = ["Focado", "Organizado", "Proativo", "Boa comunicação"];

  const contacts = [
    {
      label: "Email",
      value: "kristysonalps@gmail.com"
    },
    {
      label: "Telefone",
      value: "+55 (81) 99400-4450"
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/kristyson-alpino"
    }
  ];

  if (view === "hangman") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "24px"
        }}
      >
        <nav
          style={{
            maxWidth: "880px",
            margin: "0 auto 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <button
            type="button"
            onClick={() => setView("portfolio")}
            style={{
              padding: "10px 20px",
              background: "white",
              color: "#20204d",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            ← Voltar ao portfólio
          </button>
        </nav>

        <HangmanGame />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}
    >
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          padding: "16px 0",
          zIndex: 1000,
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h2 style={{ margin: 0, color: "#20204d" }}>Kristyson Silva</h2>
          <button
            type="button"
            onClick={() => setView("hangman")}
            style={{
              padding: "10px 22px",
              background: "#20204d",
              color: "white",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "transform 0.2s ease"
            }}
          >
            🎯 Jogo da Forca
          </button>
        </div>
      </nav>

      <div style={{ paddingTop: "96px" }}>
        <section
          style={{
            padding: "72px 24px",
            textAlign: "center",
            color: "white"
          }}
        >
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                margin: "0 auto 32px",
                border: "6px solid rgba(255, 255, 255, 0.9)",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
                overflow: "hidden",
                cursor: "pointer"
              }}
            >
              <Image
                src={currentPhoto}
                alt="Foto de Kristyson Silva"
                width={220}
                height={220}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onClick={togglePhoto}
                priority
              />
            </div>

            <h1
              style={{
                fontSize: "3.2rem",
                margin: "0 0 16px",
                fontWeight: "bold",
                textShadow: "2px 2px 16px rgba(0, 0, 0, 0.35)"
              }}
            >
              KRISTYSON SILVA
            </h1>

            <p style={{ fontSize: "1.4rem", margin: "0 0 24px", opacity: 0.95 }}>
              Desenvolvedor de soluções digitais | Técnico em Informática
            </p>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                opacity: 0.85,
                maxWidth: "680px",
                margin: "0 auto"
              }}
            >
              Estudante de Ciência da Computação na UNICAP e estagiário em desenvolvimento de sistemas no SENAI Santo Amaro. Apaixonado por transformar demandas em soluções digitais completas, com foco em automação, integração de plataformas e experiência do usuário.
            </p>
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "white" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                textAlign: "center",
                marginBottom: "48px",
                color: "#20204d"
              }}
            >
              Sobre mim
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "32px"
              }}
            >
              <div>
                <h3 style={{ color: "#20204d", marginBottom: "16px" }}>
                  🎯 Objetivo profissional
                </h3>
                <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#4a4a4a" }}>
                  Atuar em projetos de tecnologia e inovação, contribuindo com soluções digitais, desenvolvimento de software e estratégias de automação. Busco desafios que ampliem meu conhecimento em tecnologia, aprendendo com profissionais experientes e gerando resultados para o negócio.
                </p>
              </div>

              <div>
                <h3 style={{ color: "#20204d", marginBottom: "16px" }}>
                  💡 Destaques
                </h3>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "grid",
                    gap: "12px"
                  }}
                >
                  <li
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      padding: "16px",
                      borderRadius: "12px",
                      color: "white"
                    }}
                  >
                    Estagiário responsável por evoluir e manter plataformas web utilizadas por diferentes setores do SENAI Santo Amaro.
                  </li>
                  <li
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      padding: "16px",
                      borderRadius: "12px",
                      color: "white"
                    }}
                  >
                    Experiência em projetos integradores com squads multidisciplinares, entregando automações, relatórios e protótipos funcionais.
                  </li>
                  <li
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      padding: "16px",
                      borderRadius: "12px",
                      color: "white"
                    }}
                  >
                    Foco em documentação, comunicação com usuários finais e aprendizado contínuo de novas tecnologias.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "#f8f9fa" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                textAlign: "center",
                marginBottom: "48px",
                color: "#20204d"
              }}
            >
              Experiência profissional
            </h2>

            <div style={{ display: "grid", gap: "24px" }}>
              {experiences.map((experience) => (
                <div
                  key={`${experience.company}-${experience.role}`}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    border: "1px solid #e9ecef"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: "12px"
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, color: "#20204d" }}>{experience.role}</h3>
                      <p style={{ margin: 0, color: "#6c757d" }}>{experience.company}</p>
                    </div>
                    <span style={{ color: "#495057", fontWeight: "bold" }}>
                      {experience.period}
                    </span>
                  </div>

                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#4a4a4a", lineHeight: 1.6 }}>
                    {experience.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "white" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                textAlign: "center",
                marginBottom: "48px",
                color: "#20204d"
              }}
            >
              Formação acadêmica
            </h2>

            <div style={{ display: "grid", gap: "24px" }}>
              {education.map((item) => (
                <div
                  key={`${item.institution}-${item.course}`}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid #e9ecef"
                  }}
                >
                  <h3 style={{ margin: "0 0 8px", color: "#20204d" }}>{item.institution}</h3>
                  <p style={{ margin: "0 0 4px", color: "#495057", fontWeight: "bold" }}>
                    {item.course}
                  </p>
                  <p style={{ margin: 0, color: "#6c757d" }}>{item.period}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "#f8f9fa" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                textAlign: "center",
                marginBottom: "48px",
                color: "#20204d"
              }}
            >
              Habilidades
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "24px"
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                  border: "1px solid #e9ecef"
                }}
              >
                <h3 style={{ color: "#20204d", marginBottom: "16px" }}>Hard skills</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#4a4a4a", lineHeight: 1.6 }}>
                  {hardSkills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
                  border: "1px solid #e9ecef"
                }}
              >
                <h3 style={{ color: "#20204d", marginBottom: "16px" }}>Soft skills</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#4a4a4a", lineHeight: 1.6 }}>
                  {softSkills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "64px 24px", background: "white" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.4rem",
                textAlign: "center",
                marginBottom: "48px",
                color: "#20204d"
              }}
            >
              Projetos em destaque
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px"
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.title}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    border: "1px solid #e9ecef",
                    display: "grid",
                    gap: "16px"
                  }}
                >
                  <h3 style={{ margin: 0, color: "#20204d" }}>{project.title}</h3>
                  <p style={{ margin: 0, color: "#4a4a4a", lineHeight: 1.6 }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: "6px 14px",
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          borderRadius: "999px",
                          fontSize: "0.85rem",
                          fontWeight: "bold"
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer
          style={{
            padding: "56px 24px",
            background: "#20204d",
            color: "white",
            textAlign: "center"
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "16px", fontSize: "2rem" }}>
              Vamos conversar?
            </h3>
            <p style={{ marginBottom: "32px", fontSize: "1.1rem", opacity: 0.85 }}>
              Estou disponível para oportunidades de estágio, projetos colaborativos e parcerias em tecnologia.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "32px"
              }}
            >
              {contacts.map((contact) => (
                <div
                  key={contact.label}
                  style={{
                    padding: "12px 24px",
                    background: "rgba(255, 255, 255, 0.12)",
                    borderRadius: "999px",
                    fontWeight: "bold"
                  }}
                >
                  {contact.label}: {contact.value}
                </div>
              ))}
            </div>

            <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>
              © 2024 Kristyson Silva — Desenvolvido com dedicação e muito café ☕
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
