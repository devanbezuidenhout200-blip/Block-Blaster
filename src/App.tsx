import { useState, useEffect } from "react";
import Home from "@/pages/Home";
import LevelSelect from "@/pages/LevelSelect";
import Game from "@/pages/Game";

type Screen = "home" | "levels" | "game";

const STORAGE_KEY_SCORES = "bb_scores";
const STORAGE_KEY_UNLOCKED = "bb_unlocked";

function loadScores(): Record<number, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SCORES) ?? "{}"); } catch { return {}; }
}
function saveScores(scores: Record<number, number>) {
  localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
}
function loadUnlocked(): number {
  try { return parseInt(localStorage.getItem(STORAGE_KEY_UNLOCKED) ?? "1"); } catch { return 1; }
}
function saveUnlocked(n: number) {
  localStorage.setItem(STORAGE_KEY_UNLOCKED, String(n));
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [stageIndex, setStageIndex] = useState(0);
  const [highScores, setHighScores] = useState<Record<number, number>>(loadScores);
  const [unlockedUpTo, setUnlockedUpTo] = useState<number>(loadUnlocked);

  const completedCount = Object.keys(highScores).length;
  const totalScore = Object.values(highScores).reduce((a, b) => a + b, 0);

  function handleScore(stage: number, score: number) {
    setHighScores((prev) => {
      const updated = { ...prev, [stage]: Math.max(prev[stage] ?? 0, score) };
      saveScores(updated);
      return updated;
    });
    setUnlockedUpTo((prev) => {
      const next = Math.max(prev, stage + 1);
      saveUnlocked(next);
      return next;
    });
  }

  function handlePlay() {
    const lastIndex = Math.max(0, unlockedUpTo - 1);
    setStageIndex(Math.min(lastIndex, 99));
    setScreen("game");
  }

  function handleSelectLevel(index: number) {
    setStageIndex(index);
    setScreen("game");
  }

  function handleNextLevel() {
    const next = stageIndex + 1;
    if (next < 100) {
      setStageIndex(next);
    } else {
      setScreen("home");
    }
  }

  return (
    <div className="app-root">
      {screen === "home" && (
        <Home
          onPlay={handlePlay}
          onLevelSelect={() => setScreen("levels")}
          totalScore={totalScore}
          completedCount={completedCount}
        />
      )}
      {screen === "levels" && (
        <LevelSelect
          unlockedUpTo={unlockedUpTo}
          highScores={highScores}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen("home")}
        />
      )}
      {screen === "game" && (
        <Game
          stageIndex={stageIndex}
          onBack={() => setScreen("levels")}
          onNextLevel={handleNextLevel}
          highScores={highScores}
          onScore={handleScore}
        />
      )}
    </div>
  );
}
