"use client";

import { useState } from "react";
import Dice from "../components/Dice";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function Home() {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const [rollHistory, setRollHistory] = useState<number[]>([]);
  const [rollProgress, setRollProgress] = useState(0);

  const [sixCount, setSixCount] = useState(0);

  const [factIndex, setFactIndex] = useState(0);
  const [factsMinimized, setFactsMinimized] = useState(false);

  const [probAnswer, setProbAnswer] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");

  const [xp, setXp] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [roundCompleted, setRoundCompleted] = useState(false);

  const teachingFacts = [
    {
      title: "What is Probability?",
      concept: "Probability tells us how likely an event is to happen.",
      function:
        "Probability = Number of Favorable Outcomes ÷ Total Number of Possible Outcomes",
      latex: "P(E) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}",
      example:
        "Example: A fair die has 6 equally likely outcomes (1, 2, 3, 4, 5, 6).",
    },
    {
      title: "Probability of a Specific Outcome",
      concept: "To find the probability of rolling a specific number on a fair die:",
      function: "P(rolling a 6) = 1 ÷ 6",
      latex: "P(6) = \\frac{1}{6}",
      example: "Example: Only one face shows a 6, and there are 6 faces total.",
    },
    {
      title: "What is Expected Value?",
      concept:
        "Expected value tells us how many times an event should occur based on probability.",
      function: "Expected Value = Number of Trials × Probability",
      latex: "E(X) = n \\cdot P",
      example:
        "Example: If you roll a die many times, you expect each number to appear equally often.",
    },
    {
      title: "Expected Value Example",
      concept: "Let’s apply the expected value formula to rolling a 6 in 30 rolls.",
      function: "Expected 6s = 30 × (1 ÷ 6)",
      latex: "E(6s) = 30 \\cdot \\frac{1}{6} = 5",
      example: "Example: Expected 6s = 5.",
    },
    {
      title: "Probability Does NOT Guarantee Accuracy",
      concept:
        "Probability describes what SHOULD happen in the long run, not what WILL happen every time.",
      function:
        "Law of Large Numbers: As trials increase, empirical probability approaches theoretical probability.",
      latex:
        "P_{empirical} \\to P_{theoretical} \\text{ as } n \\to \\infty",
      example:
        "Example: Expected 6s = 5, but you might get 2, 4, 7, or any number.",
    },
  ];

  const rollThirty = async () => {
    setRolling(true);
    setRollHistory([]);
    setSixCount(0);
    setRollProgress(0);

    let history: number[] = [];

    for (let i = 0; i < 30; i++) {
      const r = Math.floor(Math.random() * 6) + 1;

      setRolling(true);
      await new Promise((res) => setTimeout(res, 250));

      setRolling(false);
      setValue(r);

      await new Promise((res) => setTimeout(res, 600));

      history.push(r);
      setRollHistory([...history]);

      if (r === 6) {
        setSixCount((prev) => prev + 1);
      }

      setRollProgress(i + 1);
    }

    setRolling(false);
  };

  const startRound = async () => {
    setRoundCompleted(false);
    setFeedback("");
    setXp(0);

    await rollThirty();

    let points = 0;

    const normalizedProb = probAnswer.trim().replace(/\s+/g, "").toLowerCase();
    if (
      normalizedProb === "1/6" ||
      normalizedProb === "0.167" ||
      normalizedProb === "0.166" ||
      normalizedProb === "16.7%" ||
      normalizedProb === "16.67%"
    ) {
      points += 25;
    }

    const guessedExpected = Number(expectedAnswer);
    if (!isNaN(guessedExpected)) {
      const diff = Math.abs(guessedExpected - sixCount);
      if (diff === 0) points += 75;
      else if (diff === 1) points += 50;
      else if (diff <= 2) points += 25;
    }

    setXp(points);
    setRoundCompleted(true);

    // FIX: feedback should NOT include actual sixes or probability
    setFeedback(`You predicted ${expectedAnswer} sixes.`);
  };

  const nextFact = () => {
    if (factIndex < teachingFacts.length - 1) setFactIndex(factIndex + 1);
    else setFactIndex(0);
  };

  const prevFact = () => {
    if (factIndex > 0) setFactIndex(factIndex - 1);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#000" }}>
      <h1 style={{color:"whitesmoke"}}>🎲 Probability Learning Lab</h1>

      {/* FACTS */}
      <div
        style={{
          background: "#e2e8f0",
          padding: "1rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          position: "relative",
        }}
      >
        <button
          onClick={() => setFactsMinimized(!factsMinimized)}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "#000",
            color: "#fff",
            borderRadius: "6px",
            padding: "4px 8px",
          }}
        >
          {factsMinimized ? "Expand" : "Minimize"}
        </button>

        {!factsMinimized && (
          <>
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "#000",
                color: "#fff",
                borderRadius: "6px",
                padding: "4px 8px",
              }}
            >
              {factIndex + 1} / {teachingFacts.length}
            </div>

            <h2>{teachingFacts[factIndex].title}</h2>
            <p>{teachingFacts[factIndex].concept}</p>
            <p style={{ fontWeight: "bold" }}>
              {teachingFacts[factIndex].function}
            </p>
            <BlockMath math={teachingFacts[factIndex].latex} />
            <p style={{ fontStyle: "italic" }}>
              {teachingFacts[factIndex].example}
            </p>

            <button
              onClick={prevFact}
              disabled={factIndex === 0}
              style={{ marginRight: "1rem" }}
            >
              Back
            </button>

            <button onClick={nextFact}>
              {factIndex === teachingFacts.length - 1
                ? "Start Over"
                : "Next"}
            </button>
          </>
        )}
      </div>

      {/* GAME */}
      <div
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
        }}
      >
        <h2>🎲 Probability Dice Game 🎮</h2>

        <p>Guess the theoretical probability of rolling a 6:</p>
        <input
          value={probAnswer}
          onChange={(e) => setProbAnswer(e.target.value)}
          style={{ marginBottom: "1.5rem" }}
        />

        <p>Guess how many 6s will appear in 30 rolls:</p>
        <input
          value={expectedAnswer}
          onChange={(e) => setExpectedAnswer(e.target.value)}
          style={{ marginBottom: "1.5rem" }}
        />
<br/>
        <button
          onClick={startRound}
          disabled={rolling}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            marginTop: "1rem",
          }}
        >
          {rolling ? "Rolling…" : "Play Round"}
        </button>

        {/* STATUS BAR */}
        <p style={{ marginBottom: "1rem"}}>
          <em><strong>Rolling:</strong> {rollProgress} / 30 </em>
       
      </p>

        <Dice value={value} rolling={rolling} />

        <h3>Rolls:</h3>
        <p>{rollHistory.join(", ")}</p>

        <p>
          <strong>Sixes Rolled:</strong> {sixCount}
        </p>

        <p>
          <strong>Empirical Probability:</strong>{" "}
          {(sixCount / 30).toFixed(3)}
        </p>

        {roundCompleted && (
          <div
            style={{
              marginTop: "1rem",
              background: "#f1f5f9",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>Round Summary</h3>

            
              <p><strong>{feedback}</strong></p>
              <p>
              <strong>Actual sixes:</strong> {sixCount}
              </p> 

            <h3>
             Points Earned: +{xp}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}