import { AdBanner } from "@/components/AdBanner";

interface Props {
  onPlay: () => void;
  onLevelSelect: () => void;
  totalScore: number;
  completedCount: number;
}

export default function Home({ onPlay, onLevelSelect, totalScore, completedCount }: Props) {
  return (
    <div className="home-page">
      <div className="home-bg" />
      <div className="home-content">
        <div className="home-top-ad">
          <AdBanner slot="4455667788" format="horizontal" />
        </div>

        <div className="home-hero">
          <div className="game-logo">
            <div className="logo-block b1" />
            <div className="logo-block b2" />
            <div className="logo-block b3" />
            <div className="logo-ball" />
          </div>
          <h1 className="game-title">BLOCK BLASTER</h1>
          <p className="game-subtitle">100 Epic Stages of Pure Block-Breaking Action</p>
        </div>

        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Stages Cleared</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <div className="stat-value">{totalScore.toLocaleString()}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <div className="stat-value">100</div>
            <div className="stat-label">Total Stages</div>
          </div>
        </div>

        <div className="home-buttons">
          <button className="btn-start" onClick={onPlay}>
            ▶ PLAY NOW
          </button>
          <button className="btn-levels" onClick={onLevelSelect}>
            Stage Select
          </button>
        </div>

        <div className="home-how">
          <h3>How to Play</h3>
          <ul className="how-list">
            <li><span className="how-icon">🖱</span> Move mouse / finger to control the paddle</li>
            <li><span className="how-icon">👆</span> Click / tap to launch the ball</li>
            <li><span className="how-icon">💥</span> Break all colored blocks to advance</li>
            <li><span className="how-icon">⚫</span> Gray blocks cannot be destroyed</li>
            <li><span className="how-icon">❤</span> You have 3 lives per stage</li>
          </ul>
        </div>

        <div className="home-bottom-ad">
          <AdBanner slot="5566778899" format="horizontal" />
        </div>
      </div>
    </div>
  );
}
