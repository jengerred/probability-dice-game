"use client";

import React from "react";

interface DiceProps {
  value: number;
  rolling: boolean;
}

export default function Dice({ value, rolling }: DiceProps) {
  return (
    <div
      style={{
        width: "80px",
        height: "80px",
        margin: "1rem auto",
        borderRadius: "12px",
        background: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2rem",
        border: "2px solid #e2e8f0",
      }}
    >
      {rolling ? "🎲" : value}
    </div>
  );
}
