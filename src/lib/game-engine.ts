import { LevelConfig, BlockType } from "./levels";

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 600;
export const BALL_RADIUS = 8;
export const BLOCK_ROWS = 10;
export const BLOCK_COLS = 12;
export const BLOCK_HEIGHT = 22;
export const BLOCK_GAP = 3;
export const BLOCK_PADDING_X = 8;
export const BLOCK_PADDING_TOP = 60;

export type PowerUpType = "multiball" | "wide" | "laser" | "slow" | "shield";

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  type: BlockType;
  hp: number;
  maxHp: number;
  destroyed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
  vy: number;
  collected: boolean;
}

export interface LaserBeam {
  id: number;
  x: number;
  y: number;
}

export interface ActiveEffects {
  wide: number;       // remaining seconds
  slow: number;
  laser: number;
  shield: number;
  basePaddleWidth: number;
  baseSpeed: number;
}

export interface GameState {
  balls: Ball[];
  paddle: Paddle;
  blocks: Block[];
  particles: Particle[];
  powerups: PowerUp[];
  lasers: LaserBeam[];
  activeEffects: ActiveEffects;
  score: number;
  lives: number;
  phase: "idle" | "playing" | "dead" | "won" | "gameover";
  combo: number;
  comboTimer: number;
  level: LevelConfig;
  _nextId: number;
}

export const BLOCK_COLORS: Record<number, string[]> = {
  1: ["#22d3ee", "#06b6d4"],
  2: ["#a78bfa", "#7c3aed"],
  3: ["#f97316", "#ea580c"],
  4: ["#6b7280", "#374151"],
};

export const BLOCK_HIT_COLORS: Record<number, string> = {
  1: "#ffffff",
  2: "#e879f9",
  3: "#fbbf24",
  4: "#9ca3af",
};

export const POWERUP_CONFIG: Record<PowerUpType, { color: string; glow: string; label: string; icon: string }> = {
  multiball: { color: "#4ade80", glow: "#16a34a", label: "MULTI", icon: "⚡" },
  wide:      { color: "#38bdf8", glow: "#0284c7", label: "WIDE",  icon: "↔" },
  laser:     { color: "#f87171", glow: "#dc2626", label: "LASER", icon: "🔴" },
  slow:      { color: "#fbbf24", glow: "#d97706", label: "SLOW",  icon: "⏱" },
  shield:    { color: "#c084fc", glow: "#9333ea", label: "SHIELD",icon: "🛡" },
};

const POWERUP_TYPES: PowerUpType[] = ["multiball", "wide", "laser", "slow", "shield"];
const DROP_CHANCE = 0.22; // 22% per destroyed block
const POWERUP_W = 44;
const POWERUP_H = 18;
const LASER_SPEED = 10;
const LASER_W = 4;
const EFFECT_DURATION = 10; // seconds
const WIDE_MULT = 1.6;
const SLOW_MULT = 0.55;
const SHIELD_Y_OFFSET = 20;

function blockWidth(): number {
  return (CANVAS_WIDTH - BLOCK_PADDING_X * 2 - BLOCK_GAP * (BLOCK_COLS - 1)) / BLOCK_COLS;
}

function defaultEffects(basePaddleWidth: number, baseSpeed: number): ActiveEffects {
  return { wide: 0, slow: 0, laser: 0, shield: 0, basePaddleWidth, baseSpeed };
}

export function initGameState(level: LevelConfig): GameState {
  const bw = blockWidth();
  const blocks: Block[] = [];

  level.grid.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (cell === 0) return;
      const hp = cell === 4 ? 999 : cell;
      blocks.push({
        x: BLOCK_PADDING_X + ci * (bw + BLOCK_GAP),
        y: BLOCK_PADDING_TOP + ri * (BLOCK_HEIGHT + BLOCK_GAP),
        width: bw,
        height: BLOCK_HEIGHT,
        type: cell,
        hp,
        maxHp: hp,
        destroyed: false,
      });
    });
  });

  const paddleY = CANVAS_HEIGHT - 50;
  const paddleW = level.paddleWidth;

  return {
    balls: [{ x: CANVAS_WIDTH / 2, y: paddleY - BALL_RADIUS - 2, vx: 0, vy: 0, active: false }],
    paddle: { x: CANVAS_WIDTH / 2 - paddleW / 2, y: paddleY, width: paddleW, height: 14 },
    blocks,
    particles: [],
    powerups: [],
    lasers: [],
    activeEffects: defaultEffects(paddleW, level.ballSpeed),
    score: 0,
    lives: 3,
    phase: "idle",
    combo: 0,
    comboTimer: 0,
    level,
    _nextId: 1,
  };
}

export function launchBall(state: GameState): GameState {
  if (state.phase !== "idle") return state;
  const speed = state.activeEffects.slow > 0
    ? state.activeEffects.baseSpeed * SLOW_MULT
    : state.activeEffects.baseSpeed;
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 6);
  return {
    ...state,
    phase: "playing",
    balls: state.balls.map((b) => ({
      ...b,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      active: true,
    })),
  };
}

export function fireLaser(state: GameState): GameState {
  if (state.phase !== "playing" || state.activeEffects.laser <= 0) return state;
  const cx = state.paddle.x + state.paddle.width / 2;
  const id = state._nextId;
  return {
    ...state,
    _nextId: id + 2,
    lasers: [
      ...state.lasers,
      { id, x: cx - 10, y: state.paddle.y - 2 },
      { id: id + 1, x: cx + 10, y: state.paddle.y - 2 },
    ],
  };
}

function spawnParticles(particles: Particle[], x: number, y: number, color: string, count: number): Particle[] {
  const newPs: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    newPs.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 2 + Math.random() * 3,
    });
  }
  return [...particles, ...newPs];
}

export function stepGame(state: GameState, dt: number): GameState {
  if (state.phase !== "playing") return state;

  let { balls, paddle, blocks, particles, powerups, lasers, activeEffects, score, lives, combo, comboTimer, _nextId } = state;

  // --- Tick active effects ---
  const dtSec = dt / 60;
  let ae = { ...activeEffects };
  ae.wide   = Math.max(0, ae.wide   - dtSec);
  ae.slow   = Math.max(0, ae.slow   - dtSec);
  ae.laser  = Math.max(0, ae.laser  - dtSec);
  ae.shield = Math.max(0, ae.shield - dtSec);

  // Recalculate paddle width based on wide effect
  const targetW = ae.wide > 0
    ? Math.min(CANVAS_WIDTH - 20, ae.basePaddleWidth * WIDE_MULT)
    : ae.basePaddleWidth;
  paddle = { ...paddle, width: targetW };

  // Update particles
  particles = particles
    .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.1, life: p.life - 1 }))
    .filter((p) => p.life > 0);

  // Update combo timer
  comboTimer = Math.max(0, comboTimer - dt);
  if (comboTimer === 0) combo = 0;

  let newLives = lives;
  let newPhase: GameState["phase"] = "playing";

  // Shield Y position
  const shieldY = CANVAS_HEIGHT - SHIELD_Y_OFFSET;

  // --- Move laser beams upward, check block collisions ---
  lasers = lasers
    .map((l) => ({ ...l, y: l.y - LASER_SPEED }))
    .filter((l) => l.y + 20 > 0);

  // Laser vs blocks
  lasers = lasers.filter((laser) => {
    let hit = false;
    blocks = blocks.map((block) => {
      if (block.destroyed || hit) return block;
      if (
        laser.x + LASER_W / 2 > block.x &&
        laser.x - LASER_W / 2 < block.x + block.width &&
        laser.y < block.y + block.height &&
        laser.y + 20 > block.y &&
        block.type !== 4
      ) {
        hit = true;
        const newHp = block.hp - 1;
        const destroyed = newHp <= 0;
        const blockColor = BLOCK_COLORS[block.type]?.[0] ?? "#fff";
        score += (4 - block.type + 1) * 10 * (combo + 1);
        combo++;
        comboTimer = 2;
        if (destroyed && Math.random() < DROP_CHANCE) {
          const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
          powerups = [...powerups, { id: _nextId++, type, x: block.x + block.width / 2 - POWERUP_W / 2, y: block.y, vy: 2.2, collected: false }];
        }
        particles = spawnParticles(particles, block.x + block.width / 2, block.y + block.height / 2,
          destroyed ? blockColor : BLOCK_HIT_COLORS[block.type], destroyed ? 12 : 4);
        return { ...block, hp: newHp, destroyed };
      }
      return block;
    });
    return !hit;
  });

  // --- Move balls ---
  const newBalls: Ball[] = [];
  for (const ball of balls) {
    if (!ball.active) { newBalls.push(ball); continue; }

    let { x, y, vx, vy } = ball;
    const speed = ae.slow > 0 ? ae.baseSpeed * SLOW_MULT : ae.baseSpeed;

    // Normalize speed (enforce consistent speed)
    const curSpeed = Math.sqrt(vx * vx + vy * vy);
    if (curSpeed > 0) {
      vx = (vx / curSpeed) * speed;
      vy = (vy / curSpeed) * speed;
    }

    x += vx;
    y += vy;

    // Wall collisions
    if (x - BALL_RADIUS < 0)             { x = BALL_RADIUS;                 vx =  Math.abs(vx); }
    if (x + BALL_RADIUS > CANVAS_WIDTH)  { x = CANVAS_WIDTH - BALL_RADIUS;  vx = -Math.abs(vx); }
    if (y - BALL_RADIUS < 0)             { y = BALL_RADIUS;                  vy =  Math.abs(vy); }

    // Shield collision (bottom barrier)
    if (ae.shield > 0 && vy > 0 && y + BALL_RADIUS >= shieldY && y - BALL_RADIUS < shieldY + 6) {
      y = shieldY - BALL_RADIUS;
      vy = -Math.abs(vy);
    }

    // Paddle collision
    if (
      vy > 0 &&
      y + BALL_RADIUS >= paddle.y &&
      y - BALL_RADIUS <= paddle.y + paddle.height &&
      x >= paddle.x &&
      x <= paddle.x + paddle.width
    ) {
      vy = -Math.abs(vy);
      const hitPos = (x - paddle.x) / paddle.width;
      const angle = (hitPos - 0.5) * (Math.PI * 0.7);
      const s = Math.sqrt(vx * vx + vy * vy);
      vx = Math.sin(angle) * s;
      vy = -Math.cos(angle) * s;
      y = paddle.y - BALL_RADIUS;
    }

    // Block collisions
    let spawnedExtras: Ball[] = [];
    blocks = blocks.map((block) => {
      if (block.destroyed) return block;

      const left = block.x, right = block.x + block.width;
      const top = block.y,  bottom = block.y + block.height;

      if (
        x + BALL_RADIUS > left && x - BALL_RADIUS < right &&
        y + BALL_RADIUS > top  && y - BALL_RADIUS < bottom
      ) {
        const overlapLeft   = x + BALL_RADIUS - left;
        const overlapRight  = right - (x - BALL_RADIUS);
        const overlapTop    = y + BALL_RADIUS - top;
        const overlapBottom = bottom - (y - BALL_RADIUS);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop || minOverlap === overlapBottom) vy = -vy;
        else vx = -vx;

        if (block.type !== 4) {
          const newHp = block.hp - 1;
          const destroyed = newHp <= 0;
          const blockColor = BLOCK_COLORS[block.type]?.[0] ?? "#fff";
          const pts = (4 - block.type + 1) * 10 * (combo + 1);
          score += pts;
          combo++;
          comboTimer = 2;

          // Drop power-up on destroy
          if (destroyed && Math.random() < DROP_CHANCE) {
            const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
            powerups = [...powerups, {
              id: _nextId++,
              type,
              x: block.x + block.width / 2 - POWERUP_W / 2,
              y: block.y,
              vy: 2.2,
              collected: false,
            }];
          }

          // Multiball: spawn 2 extra balls when block destroyed
          if (destroyed && ae.slow <= 0 /* avoid endless multiplication */ ) {
            // handled by power-up collect; no auto spawn here
          }

          particles = spawnParticles(particles,
            block.x + block.width / 2, block.y + block.height / 2,
            destroyed ? blockColor : BLOCK_HIT_COLORS[block.type],
            destroyed ? 12 : 5);

          return { ...block, hp: newHp, destroyed };
        }
      }
      return block;
    });

    // Ball fell off screen (below paddle, past shield)
    if (y - BALL_RADIUS > CANVAS_HEIGHT) {
      newBalls.push({ ...ball, active: false });
      continue;
    }

    newBalls.push({ ...ball, x, y, vx, vy });
  }
  balls = newBalls;

  // --- Move power-ups downward, collect on paddle ---
  powerups = powerups.map((pu) => {
    if (pu.collected) return pu;
    const ny = pu.y + pu.vy;

    // Off screen
    if (ny > CANVAS_HEIGHT) return { ...pu, collected: true };

    // Paddle collision
    if (
      ny + POWERUP_H >= paddle.y &&
      ny <= paddle.y + paddle.height &&
      pu.x + POWERUP_W >= paddle.x &&
      pu.x <= paddle.x + paddle.width
    ) {
      // Apply effect
      score += 500;
      particles = spawnParticles(particles, pu.x + POWERUP_W / 2, ny, POWERUP_CONFIG[pu.type].color, 20);

      switch (pu.type) {
        case "wide":
          ae = { ...ae, wide: EFFECT_DURATION };
          break;
        case "slow":
          ae = { ...ae, slow: EFFECT_DURATION };
          break;
        case "laser":
          ae = { ...ae, laser: EFFECT_DURATION };
          break;
        case "shield":
          ae = { ...ae, shield: EFFECT_DURATION };
          break;
        case "multiball": {
          const activeBalls = balls.filter((b) => b.active);
          const src = activeBalls[0];
          if (src) {
            const extras: Ball[] = [];
            for (let i = 0; i < 2; i++) {
              const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.8);
              const s = ae.slow > 0 ? ae.baseSpeed * SLOW_MULT : ae.baseSpeed;
              extras.push({ x: src.x, y: src.y, vx: Math.cos(angle) * s, vy: Math.sin(angle) * s, active: true });
            }
            balls = [...balls, ...extras];
          }
          break;
        }
      }

      return { ...pu, y: ny, collected: true };
    }

    return { ...pu, y: ny };
  }).filter((pu) => !pu.collected || pu.y <= CANVAS_HEIGHT);

  // Only keep uncollected
  powerups = powerups.filter((pu) => !pu.collected);

  // --- Life loss check ---
  const allBallsDead = balls.every((b) => !b.active);
  if (allBallsDead) {
    newLives--;
    ae = { ...ae, wide: 0, laser: 0, slow: 0, shield: 0 };
    paddle = { ...paddle, width: ae.basePaddleWidth };
    if (newLives <= 0) {
      newPhase = "gameover";
    } else {
      newPhase = "idle";
      balls = [{
        x: paddle.x + paddle.width / 2,
        y: paddle.y - BALL_RADIUS - 2,
        vx: 0, vy: 0,
        active: false,
      }];
    }
  }

  // --- Win check ---
  const destructibleBlocks = blocks.filter((b) => b.type !== 4);
  const allDestroyed = destructibleBlocks.length === 0 || destructibleBlocks.every((b) => b.destroyed);
  if (allDestroyed && newPhase === "playing") {
    newPhase = "won";
  }

  return {
    ...state,
    balls,
    paddle,
    blocks,
    particles,
    powerups,
    lasers,
    activeEffects: ae,
    score,
    lives: newLives,
    phase: newPhase,
    combo,
    comboTimer,
    _nextId,
  };
}

export function movePaddle(state: GameState, x: number): GameState {
  const paddleW = state.paddle.width;
  const newX = Math.max(0, Math.min(CANVAS_WIDTH - paddleW, x - paddleW / 2));
  const newPaddle = { ...state.paddle, x: newX };

  const balls = state.balls.map((b) => {
    if (!b.active) return { ...b, x: newPaddle.x + paddleW / 2 };
    return b;
  });

  return { ...state, paddle: newPaddle, balls };
}

export function drawGame(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { balls, paddle, blocks, particles, powerups, lasers, activeEffects: ae } = state;
  const shieldY = CANVAS_HEIGHT - SHIELD_Y_OFFSET;

  // Background
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < CANVAS_WIDTH; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, CANVAS_HEIGHT); ctx.stroke();
  }
  for (let gy = 0; gy < CANVAS_HEIGHT; gy += 40) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(CANVAS_WIDTH, gy); ctx.stroke();
  }

  // Shield barrier
  if (ae.shield > 0) {
    const alpha = Math.min(1, ae.shield);
    ctx.globalAlpha = alpha;
    const shieldGrad = ctx.createLinearGradient(0, shieldY, 0, shieldY + 6);
    shieldGrad.addColorStop(0, "#c084fc");
    shieldGrad.addColorStop(1, "#7e22ce");
    ctx.shadowColor = "#c084fc";
    ctx.shadowBlur = 16;
    ctx.fillStyle = shieldGrad;
    ctx.fillRect(0, shieldY, CANVAS_WIDTH, 6);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Flicker warning when < 3s left
    if (ae.shield < 3) {
      const flicker = Math.sin(Date.now() * 0.015) * 0.3 + 0.7;
      ctx.globalAlpha = flicker;
      ctx.fillStyle = "rgba(192,132,252,0.3)";
      ctx.fillRect(0, shieldY - 4, CANVAS_WIDTH, 14);
      ctx.globalAlpha = 1;
    }
  }

  // Particles
  particles.forEach((p) => {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Laser beams
  lasers.forEach((laser) => {
    ctx.shadowColor = "#f87171";
    ctx.shadowBlur = 14;
    const lg = ctx.createLinearGradient(laser.x, laser.y, laser.x, laser.y + 20);
    lg.addColorStop(0, "#fca5a5");
    lg.addColorStop(1, "#dc2626");
    ctx.fillStyle = lg;
    ctx.fillRect(laser.x - LASER_W / 2, laser.y, LASER_W, 20);
    ctx.shadowBlur = 0;
  });

  // Power-up capsules
  powerups.forEach((pu) => {
    const cfg = POWERUP_CONFIG[pu.type];
    ctx.shadowColor = cfg.glow;
    ctx.shadowBlur = 14;

    // Capsule body
    const grad = ctx.createLinearGradient(pu.x, pu.y, pu.x, pu.y + POWERUP_H);
    grad.addColorStop(0, cfg.color);
    grad.addColorStop(1, cfg.glow);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(pu.x, pu.y, POWERUP_W, POWERUP_H, POWERUP_H / 2);
    ctx.fill();

    // Shine
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.roundRect(pu.x + 4, pu.y + 3, POWERUP_W - 8, 5, 3);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cfg.label, pu.x + POWERUP_W / 2, pu.y + POWERUP_H / 2);
  });

  // Blocks
  blocks.forEach((block) => {
    if (block.destroyed) return;
    const colors = BLOCK_COLORS[block.type] ?? ["#888", "#555"];

    ctx.shadowColor = colors[0];
    ctx.shadowBlur = 8;

    const grad = ctx.createLinearGradient(block.x, block.y, block.x, block.y + block.height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(block.x, block.y, block.width, block.height, 3);
    ctx.fill();

    ctx.shadowBlur = 0;

    if (block.hp < block.maxHp && block.type !== 4) {
      const hpRatio = block.hp / block.maxHp;
      ctx.fillStyle = `rgba(0,0,0,${0.5 * (1 - hpRatio)})`;
      ctx.beginPath();
      ctx.roundRect(block.x, block.y, block.width, block.height, 3);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      for (let i = 0; i < (block.maxHp - block.hp); i++) {
        ctx.beginPath();
        ctx.moveTo(block.x + 5 + i * 10, block.y + 5);
        ctx.lineTo(block.x + block.width - 5 - i * 10, block.y + block.height - 5);
        ctx.stroke();
      }
    }

    if (block.type === 4) {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.roundRect(block.x, block.y, block.width, block.height / 2, [3, 3, 0, 0]);
      ctx.fill();
    }

    ctx.strokeStyle = colors[0] + "66";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(block.x, block.y, block.width, block.height, 3);
    ctx.stroke();
  });

  // Paddle — tint when effect active
  let padColor0 = "#38bdf8";
  let padColor1 = "#0284c7";
  let padGlow   = "#38bdf8";
  if (ae.wide   > 0) { padColor0 = "#38bdf8"; padColor1 = "#0284c7"; padGlow = "#38bdf8"; }
  if (ae.laser  > 0) { padColor0 = "#fca5a5"; padColor1 = "#dc2626"; padGlow = "#f87171"; }
  if (ae.slow   > 0) { padColor0 = "#fde68a"; padColor1 = "#d97706"; padGlow = "#fbbf24"; }
  if (ae.shield > 0) { padColor0 = "#d8b4fe"; padColor1 = "#9333ea"; padGlow = "#c084fc"; }

  const padGrad = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
  padGrad.addColorStop(0, padColor0);
  padGrad.addColorStop(1, padColor1);
  ctx.shadowColor = padGlow;
  ctx.shadowBlur = 18;
  ctx.fillStyle = padGrad;
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 7);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.roundRect(paddle.x + 4, paddle.y + 2, paddle.width - 8, 4, 2);
  ctx.fill();

  // Laser icon on paddle when active
  if (ae.laser > 0) {
    ctx.fillStyle = "#fca5a5";
    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LASER", paddle.x + paddle.width / 2, paddle.y + paddle.height / 2);
  }

  // Balls
  balls.forEach((ball) => {
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 18;
    const ballGrad = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, BALL_RADIUS);
    ballGrad.addColorStop(0, "#fef9c3");
    ballGrad.addColorStop(0.5, "#fbbf24");
    ballGrad.addColorStop(1, "#d97706");
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Active effect timers HUD (bottom-left)
  const activeList: { label: string; time: number; color: string }[] = [];
  if (ae.wide   > 0) activeList.push({ label: "↔ WIDE",   time: ae.wide,   color: "#38bdf8" });
  if (ae.laser  > 0) activeList.push({ label: "🔴 LASER",  time: ae.laser,  color: "#f87171" });
  if (ae.slow   > 0) activeList.push({ label: "⏱ SLOW",   time: ae.slow,   color: "#fbbf24" });
  if (ae.shield > 0) activeList.push({ label: "🛡 SHIELD", time: ae.shield, color: "#c084fc" });

  activeList.forEach((eff, i) => {
    const px = 8;
    const py = CANVAS_HEIGHT - 14 - i * 18;
    const barW = 80;
    const ratio = Math.min(1, eff.time / EFFECT_DURATION);

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.roundRect(px, py, barW + 52, 14, 4);
    ctx.fill();

    ctx.fillStyle = eff.color + "55";
    ctx.beginPath();
    ctx.roundRect(px, py, (barW + 52) * ratio, 14, 4);
    ctx.fill();

    ctx.fillStyle = eff.color;
    ctx.font = "bold 8px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`${eff.label}  ${eff.time.toFixed(1)}s`, px + 5, py + 7);
  });
  ctx.textAlign = "left";

  // Combo display
  if (state.combo > 1) {
    const alpha = Math.min(1, state.comboTimer);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fbbf24";
    ctx.font = `bold ${10 + Math.min(state.combo, 8)}px 'Inter', sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`x${state.combo} COMBO!`, CANVAS_WIDTH - 8, 8);
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = "left";
}
