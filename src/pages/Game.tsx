import { useEffect, useRef, useCallback, useState } from "react";
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, BALL_RADIUS,
  initGameState, launchBall, stepGame, movePaddle, drawGame, fireLaser,
  GameState, POWERUP_CONFIG,
} from "@/lib/game-engine";
import { LEVELS } from "@/lib/levels";
import { AdBanner } from "@/components/AdBanner";

interface Props {
  stageIndex: number;
  onBack: () => void;
  onNextLevel: () => void;
  highScores: Record<number, number>;
  onScore: (stage: number, score: number) => void;
}

export default function Game({ stageIndex, onBack, onNextLevel, highScores, onScore }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const animRef = useRef<number>(0);
  const [displayState, setDisplayState] = useState<GameState | null>(null);

  const level = LEVELS[stageIndex];

  const resetGame = useCallback(() => {
    const s = initGameState(level);
    stateRef.current = s;
    setDisplayState({ ...s });
  }, [level]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let lastTime = performance.now();

    function loop(now: number) {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      const ctx = canvas!.getContext("2d");
      if (!ctx) return;

      if (stateRef.current && stateRef.current.phase === "playing") {
        const next = stepGame(stateRef.current, dt);
        stateRef.current = next;
        setDisplayState({ ...next });
      }

      if (stateRef.current) {
        drawGame(ctx, stateRef.current);
      }

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Record high score on win
  useEffect(() => {
    if (displayState?.phase === "won") {
      onScore(level.stage, displayState.score);
    }
  }, [displayState?.phase]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    stateRef.current = movePaddle(stateRef.current, x);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const x = (e.touches[0].clientX - rect.left) * scaleX;
    stateRef.current = movePaddle(stateRef.current, x);
  }, []);

  const handleClick = useCallback(() => {
    if (!stateRef.current) return;
    const s = stateRef.current;
    if (s.phase === "idle") {
      stateRef.current = launchBall(s);
      setDisplayState({ ...stateRef.current });
    } else if (s.phase === "playing" && s.activeEffects.laser > 0) {
      stateRef.current = fireLaser(s);
    }
  }, []);

  const state = displayState;
  const hi = highScores[level.stage] ?? 0;
  const ae = state?.activeEffects;

  return (
    <div className="game-wrapper">
      <div className="game-top-bar">
        <button className="btn-back" onClick={onBack}>← Levels</button>
        <div className="game-info">
          <span className="info-item">Stage <strong>{level.stage}</strong>/100</span>
          <span className="info-item">Score <strong>{state?.score?.toLocaleString() ?? 0}</strong></span>
          <span className="info-item">Best <strong>{hi > 0 ? hi.toLocaleString() : "–"}</strong></span>
          <span className="info-item lives-display">
            {Array.from({ length: state?.lives ?? 3 }).map((_, i) => (
              <span key={i} className="life-icon">❤</span>
            ))}
          </span>
        </div>
        <div className="stage-name">{level.name}</div>
      </div>

      {/* Active power-up indicators */}
      {ae && (ae.wide > 0 || ae.laser > 0 || ae.slow > 0 || ae.shield > 0) && (
        <div className="powerup-hud">
          {ae.wide   > 0 && <EffectPill label="↔ WIDE"   time={ae.wide}   color="#38bdf8" />}
          {ae.laser  > 0 && <EffectPill label="⚡ LASER"  time={ae.laser}  color="#f87171" />}
          {ae.slow   > 0 && <EffectPill label="⏱ SLOW"   time={ae.slow}   color="#fbbf24" />}
          {ae.shield > 0 && <EffectPill label="🛡 SHIELD" time={ae.shield} color="#c084fc" />}
        </div>
      )}

      <div className="game-layout">
        <div className="ad-side left-ad">
          <AdBanner slot="1234567890" format="vertical" />
        </div>

        <div className="canvas-area">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="game-canvas"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={handleClick}
            style={{ touchAction: "none", cursor: ae?.laser ? "crosshair" : "none" }}
          />

          {/* Launch overlay */}
          {state?.phase === "idle" && (
            <div className="game-overlay">
              <div className="overlay-content">
                <div className="overlay-title">Stage {level.stage}</div>
                <div className="overlay-subtitle">{level.name}</div>
                <div className="overlay-hint">Click or tap to launch!</div>
                <div className="overlay-tip">💡 Collect falling capsules for power-ups</div>
              </div>
            </div>
          )}

          {/* Win overlay */}
          {state?.phase === "won" && (
            <div className="game-overlay win">
              <div className="overlay-content">
                <div className="overlay-badge">⭐ STAGE CLEAR ⭐</div>
                <div className="overlay-score">Score: {state.score.toLocaleString()}</div>
                {hi > 0 && <div className="overlay-best">Best: {hi.toLocaleString()}</div>}
                <div className="overlay-actions">
                  {stageIndex < LEVELS.length - 1 ? (
                    <button className="btn-primary" onClick={onNextLevel}>Next Stage →</button>
                  ) : (
                    <button className="btn-primary" onClick={onBack}>🏆 ALL COMPLETE!</button>
                  )}
                  <button className="btn-secondary" onClick={resetGame}>Replay</button>
                </div>
              </div>
            </div>
          )}

          {/* Game over overlay */}
          {state?.phase === "gameover" && (
            <div className="game-overlay dead">
              <div className="overlay-content">
                <div className="overlay-badge dead-badge">GAME OVER</div>
                <div className="overlay-score">Score: {state.score.toLocaleString()}</div>
                <div className="overlay-actions">
                  <button className="btn-primary" onClick={resetGame}>Try Again</button>
                  <button className="btn-secondary" onClick={onBack}>Level Select</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ad-side right-ad">
          <div className="powerup-legend">
            <div className="legend-title">Power-Ups</div>
            {Object.entries(POWERUP_CONFIG).map(([key, cfg]) => (
              <div key={key} className="legend-row" style={{ color: cfg.color }}>
                <span className="legend-capsule" style={{ background: cfg.color }}>
                  {cfg.label}
                </span>
                <span className="legend-desc">{getPowerUpDesc(key)}</span>
              </div>
            ))}
            {ae?.laser && ae.laser > 0 && (
              <div className="laser-hint">Click to fire!</div>
            )}
          </div>
          <AdBanner slot="0987654321" format="vertical" />
        </div>
      </div>

      <div className="bottom-ad">
        <AdBanner slot="1122334455" format="horizontal" />
      </div>
    </div>
  );
}

function EffectPill({ label, time, color }: { label: string; time: number; color: string }) {
  const pct = Math.min(100, (time / 10) * 100);
  const warning = time < 3;
  return (
    <div className={`effect-pill ${warning ? "warning" : ""}`} style={{ borderColor: color + "66" }}>
      <div className="pill-bar" style={{ width: `${pct}%`, background: color }} />
      <span className="pill-label" style={{ color }}>{label}</span>
      <span className="pill-time">{time.toFixed(1)}s</span>
    </div>
  );
}

function getPowerUpDesc(type: string): string {
  switch (type) {
    case "multiball": return "+2 balls";
    case "wide":      return "Wider paddle";
    case "laser":     return "Click to shoot";
    case "slow":      return "Slows ball";
    case "shield":    return "Bottom barrier";
    default:          return "";
  }
}
