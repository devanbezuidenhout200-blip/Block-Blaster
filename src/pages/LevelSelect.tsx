import { LEVELS } from "@/lib/levels";
import { AdBanner } from "@/components/AdBanner";

interface Props {
  unlockedUpTo: number;
  highScores: Record<number, number>;
  onSelectLevel: (index: number) => void;
  onBack: () => void;
}

const DIFFICULTY_LABELS = [
  { min: 1, max: 10, label: "Beginner", color: "#22d3ee" },
  { min: 11, max: 25, label: "Intermediate", color: "#a78bfa" },
  { min: 26, max: 40, label: "Hard", color: "#f97316" },
  { min: 41, max: 60, label: "Expert", color: "#ef4444" },
  { min: 61, max: 75, label: "Brutal", color: "#dc2626" },
  { min: 76, max: 85, label: "Infernal", color: "#991b1b" },
  { min: 86, max: 100, label: "Legendary", color: "#fbbf24" },
];

function getDifficulty(stage: number) {
  return DIFFICULTY_LABELS.find((d) => stage >= d.min && stage <= d.max) ?? DIFFICULTY_LABELS[0];
}

export default function LevelSelect({ unlockedUpTo, highScores, onSelectLevel, onBack }: Props) {
  return (
    <div className="level-select-page">
      <div className="level-select-header">
        <button className="btn-back" onClick={onBack}>← Menu</button>
        <h2 className="page-title">Select Stage</h2>
        <div className="unlocked-badge">{unlockedUpTo}/100 Unlocked</div>
      </div>

      <div className="top-ad">
        <AdBanner slot="2233445566" format="horizontal" />
      </div>

      <div className="difficulty-legend">
        {DIFFICULTY_LABELS.map((d) => (
          <span key={d.label} className="legend-item" style={{ color: d.color }}>
            <span className="legend-dot" style={{ background: d.color }} />
            {d.label}
          </span>
        ))}
      </div>

      <div className="level-grid">
        {LEVELS.map((level, index) => {
          const locked = index + 1 > unlockedUpTo;
          const completed = highScores[level.stage] !== undefined;
          const diff = getDifficulty(level.stage);
          const hi = highScores[level.stage];

          return (
            <button
              key={level.stage}
              className={`level-card ${locked ? "locked" : ""} ${completed ? "completed" : ""}`}
              onClick={() => !locked && onSelectLevel(index)}
              disabled={locked}
              style={{ "--diff-color": diff.color } as React.CSSProperties}
            >
              <div className="level-number">{level.stage}</div>
              {!locked && (
                <div className="level-name">{level.name}</div>
              )}
              {locked && <div className="lock-icon">🔒</div>}
              {completed && <div className="star-icon">⭐</div>}
              {!locked && hi && (
                <div className="level-hi">{hi.toLocaleString()}</div>
              )}
              <div
                className="diff-bar"
                style={{ background: diff.color }}
              />
            </button>
          );
        })}
      </div>

      <div className="bottom-ad">
        <AdBanner slot="3344556677" format="horizontal" />
      </div>
    </div>
  );
}
