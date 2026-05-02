export type BlockType = 0 | 1 | 2 | 3 | 4;
// 0 = empty, 1 = normal (1 hit), 2 = hard (2 hits), 3 = very hard (3 hits), 4 = indestructible

export interface LevelConfig {
  stage: number;
  name: string;
  grid: BlockType[][];
  ballSpeed: number;
  paddleWidth: number;
  extraBalls?: number;
}

const R = 10; // rows
const C = 12; // cols

function row(...cells: BlockType[]): BlockType[] {
  while (cells.length < C) cells.push(0);
  return cells.slice(0, C) as BlockType[];
}

function fill(type: BlockType): BlockType[] {
  return Array(C).fill(type) as BlockType[];
}

function empty(): BlockType[] {
  return Array(C).fill(0) as BlockType[];
}

function rowOf(indexes: number[], type: BlockType): BlockType[] {
  const r: BlockType[] = Array(C).fill(0) as BlockType[];
  indexes.forEach(i => { if (i < C) r[i] = type; });
  return r;
}

export const LEVELS: LevelConfig[] = [
  // === STAGE 1-10: Tutorial / Easy ===
  { stage: 1, name: "Warmup", ballSpeed: 3.5, paddleWidth: 120,
    grid: [empty(),empty(),empty(),fill(1),fill(1),fill(1),empty(),empty(),empty(),empty()] },

  { stage: 2, name: "First Steps", ballSpeed: 3.5, paddleWidth: 120,
    grid: [empty(),empty(),fill(1),fill(1),fill(1),fill(1),fill(1),empty(),empty(),empty()] },

  { stage: 3, name: "Three Rows", ballSpeed: 3.8, paddleWidth: 115,
    grid: [empty(),empty(),fill(1),fill(1),fill(2),fill(1),fill(1),empty(),empty(),empty()] },

  { stage: 4, name: "Checker", ballSpeed: 3.8, paddleWidth: 115,
    grid: [
      empty(),
      rowOf([0,2,4,6,8,10],1),
      rowOf([1,3,5,7,9,11],1),
      rowOf([0,2,4,6,8,10],1),
      rowOf([1,3,5,7,9,11],1),
      fill(1),
      empty(),empty(),empty(),empty()
    ] },

  { stage: 5, name: "Diamond", ballSpeed: 4.0, paddleWidth: 110,
    grid: [
      empty(),
      rowOf([5,6],1),
      rowOf([4,5,6,7],1),
      rowOf([3,4,5,6,7,8],1),
      rowOf([2,3,4,5,6,7,8,9],1),
      rowOf([3,4,5,6,7,8],1),
      rowOf([4,5,6,7],1),
      rowOf([5,6],1),
      empty(),empty()
    ] },

  { stage: 6, name: "Fortress", ballSpeed: 4.0, paddleWidth: 110,
    grid: [
      empty(),
      fill(2),
      rowOf([0,11],2),
      rowOf([0,11],2),
      rowOf([0,5,6,11],2),
      rowOf([0,11],1),
      rowOf([0,11],1),
      fill(1),
      empty(),empty()
    ] },

  { stage: 7, name: "Arrow", ballSpeed: 4.2, paddleWidth: 105,
    grid: [
      empty(),
      rowOf([5,6],2),
      rowOf([4,5,6,7],1),
      rowOf([3,4,5,6,7,8],1),
      rowOf([2,3,4,5,6,7,8,9],1),
      rowOf([3,4,5,6,7,8],1),
      rowOf([4,5,6,7],1),
      rowOf([5,6],1),
      empty(),empty()
    ] },

  { stage: 8, name: "Zigzag", ballSpeed: 4.2, paddleWidth: 105,
    grid: [
      empty(),
      rowOf([0,1,2,3],1),
      rowOf([3,4,5,6],1),
      rowOf([6,7,8,9],1),
      rowOf([9,10,11],1),
      rowOf([6,7,8,9],2),
      rowOf([3,4,5,6],2),
      rowOf([0,1,2,3],2),
      empty(),empty()
    ] },

  { stage: 9, name: "Wall Break", ballSpeed: 4.4, paddleWidth: 100,
    grid: [
      empty(),
      fill(2),
      fill(1),
      fill(1),
      rowOf([0,1,2,3,8,9,10,11],1),
      fill(1),
      fill(2),
      fill(2),
      empty(),empty()
    ] },

  { stage: 10, name: "Boss Gate", ballSpeed: 4.4, paddleWidth: 100,
    grid: [
      fill(2),
      fill(1),
      rowOf([0,11],2),
      rowOf([0,5,6,11],1),
      rowOf([0,5,6,11],1),
      rowOf([0,11],1),
      fill(1),
      fill(2),
      empty(),empty()
    ] },

  // === STAGE 11-20: Intermediate ===
  { stage: 11, name: "Cross Fire", ballSpeed: 4.6, paddleWidth: 100,
    grid: [
      empty(),
      rowOf([5,6],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],1),
      rowOf([5,6],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],1),
      rowOf([5,6],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],1),
      rowOf([5,6],2),
      empty(),empty()
    ] },

  { stage: 12, name: "Pyramid", ballSpeed: 4.6, paddleWidth: 98,
    grid: [
      empty(),
      rowOf([5,6],1),
      rowOf([4,5,6,7],1),
      rowOf([3,4,5,6,7,8],1),
      rowOf([2,3,4,5,6,7,8,9],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],2),
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],2),
      empty(),empty(),empty()
    ] },

  { stage: 13, name: "Scatter", ballSpeed: 4.7, paddleWidth: 96,
    grid: [
      empty(),
      rowOf([0,3,6,9],2),
      rowOf([1,4,7,10],1),
      rowOf([2,5,8,11],2),
      rowOf([0,3,6,9],1),
      rowOf([1,4,7,10],2),
      rowOf([2,5,8,11],1),
      rowOf([0,3,6,9],2),
      empty(),empty()
    ] },

  { stage: 14, name: "Tunnel", ballSpeed: 4.8, paddleWidth: 94,
    grid: [
      fill(1),
      rowOf([0,11],2),
      rowOf([0,11],2),
      rowOf([0,11],1),
      rowOf([0,11],1),
      rowOf([0,11],1),
      rowOf([0,11],2),
      rowOf([0,11],2),
      fill(1),
      empty()
    ] },

  { stage: 15, name: "Star Pattern", ballSpeed: 4.8, paddleWidth: 92,
    grid: [
      empty(),
      rowOf([0,2,4,6,8,10],2),
      rowOf([1,3,5,7,9,11],1),
      rowOf([0,2,4,6,8,10],1),
      rowOf([1,3,5,7,9,11],2),
      rowOf([0,2,4,6,8,10],2),
      rowOf([1,3,5,7,9,11],1),
      rowOf([0,2,4,6,8,10],1),
      empty(),empty()
    ] },

  { stage: 16, name: "Maze Runner", ballSpeed: 5.0, paddleWidth: 90,
    grid: [
      fill(1),
      rowOf([0,2,3,4,6,7,8,10,11],1),
      rowOf([0,4,8],2),
      rowOf([0,2,3,4,6,7,8,10,11],1),
      fill(2),
      rowOf([0,2,3,4,6,7,8,10,11],2),
      rowOf([0,4,8],1),
      rowOf([0,2,3,4,6,7,8,10,11],2),
      fill(1),
      empty()
    ] },

  { stage: 17, name: "Double Trouble", ballSpeed: 5.0, paddleWidth: 88,
    grid: [
      empty(),
      fill(2),
      fill(1),
      fill(2),
      empty(),
      fill(2),
      fill(1),
      fill(2),
      empty(),empty()
    ] },

  { stage: 18, name: "Spiral", ballSpeed: 5.2, paddleWidth: 86,
    grid: [
      fill(1),
      rowOf([0,1,2,3,4,5,6,7,8,9,10],2),
      rowOf([0,10],2),
      rowOf([0,2,3,4,5,6,7,8,10],1),
      rowOf([0,2,8,10],1),
      rowOf([0,2,4,5,6,8,10],2),
      rowOf([0,2,4,6,8,10],2),
      rowOf([0,10],1),
      fill(1),
      empty()
    ] },

  { stage: 19, name: "Heavy Metal", ballSpeed: 5.2, paddleWidth: 84,
    grid: [
      empty(),
      fill(3),
      fill(2),
      fill(3),
      fill(1),
      fill(2),
      fill(3),
      fill(2),
      fill(1),
      empty()
    ] },

  { stage: 20, name: "Level 20", ballSpeed: 5.4, paddleWidth: 82,
    grid: [
      rowOf([5,6],3),
      rowOf([4,5,6,7],2),
      rowOf([3,4,5,6,7,8],2),
      rowOf([2,3,4,5,6,7,8,9],1),
      rowOf([1,2,3,4,5,6,7,8,9,10],1),
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],1),
      rowOf([2,3,4,5,6,7,8,9],1),
      rowOf([3,4,5,6,7,8],2),
      rowOf([4,5,6,7],3)
    ] },

  // === STAGE 21-35: Hard ===
  { stage: 21, name: "Chess Board", ballSpeed: 5.4, paddleWidth: 80,
    grid: [
      rowOf([0,2,4,6,8,10],2),
      rowOf([1,3,5,7,9,11],3),
      rowOf([0,2,4,6,8,10],3),
      rowOf([1,3,5,7,9,11],2),
      rowOf([0,2,4,6,8,10],2),
      rowOf([1,3,5,7,9,11],3),
      rowOf([0,2,4,6,8,10],3),
      rowOf([1,3,5,7,9,11],2),
      empty(),empty()
    ] },

  { stage: 22, name: "Fortress II", ballSpeed: 5.5, paddleWidth: 80,
    grid: [
      fill(3),
      rowOf([0,11],3),
      rowOf([0,4,5,6,7,11],2),
      rowOf([0,4,7,11],2),
      rowOf([0,4,7,11],1),
      rowOf([0,11],2),
      rowOf([0,11],2),
      fill(3),
      empty(),empty()
    ] },

  { stage: 23, name: "Vortex", ballSpeed: 5.5, paddleWidth: 78,
    grid: [
      fill(2),
      rowOf([0,1,2,3,4,5,6,7,8,9,10],3),
      rowOf([0,1,9,10],2),
      rowOf([0,1,3,4,5,6,7,9,10],2),
      rowOf([0,1,3,7,9,10],3),
      rowOf([0,1,3,4,5,7,9,10],2),
      rowOf([0,1,9,10],2),
      rowOf([0,1,2,3,4,5,6,7,8,9,10],3),
      fill(2),
      empty()
    ] },

  { stage: 24, name: "Crossroads", ballSpeed: 5.6, paddleWidth: 78,
    grid: [
      rowOf([5,6],3),
      rowOf([5,6],2),
      fill(2),
      rowOf([5,6],3),
      fill(3),
      rowOf([5,6],2),
      fill(2),
      rowOf([5,6],3),
      rowOf([5,6],2),
      empty()
    ] },

  { stage: 25, name: "Quarter Mark", ballSpeed: 5.7, paddleWidth: 76,
    grid: [
      fill(3),
      fill(2),
      fill(1),
      fill(3),
      fill(2),
      fill(1),
      fill(3),
      fill(2),
      fill(1),
      fill(3)
    ] },

  { stage: 26, name: "Crater", ballSpeed: 5.7, paddleWidth: 76,
    grid: [
      fill(2),
      rowOf([0,1,2,3,8,9,10,11],2),
      rowOf([0,1,10,11],3),
      rowOf([0,11],2),
      rowOf([0,11],1),
      rowOf([0,11],2),
      rowOf([0,1,10,11],3),
      rowOf([0,1,2,3,8,9,10,11],2),
      fill(2),
      empty()
    ] },

  { stage: 27, name: "Columns", ballSpeed: 5.8, paddleWidth: 74,
    grid: [
      rowOf([0,3,6,9],3),
      rowOf([0,3,6,9],2),
      rowOf([0,3,6,9],3),
      rowOf([0,3,6,9],1),
      rowOf([0,3,6,9],3),
      rowOf([0,3,6,9],2),
      rowOf([0,3,6,9],1),
      rowOf([0,3,6,9],3),
      empty(),empty()
    ] },

  { stage: 28, name: "Battleship", ballSpeed: 5.8, paddleWidth: 74,
    grid: [
      rowOf([2,3,4,5,6,7,8,9],3),
      rowOf([1,10],2),
      rowOf([0,11],3),
      rowOf([0,2,3,4,7,8,9,11],2),
      rowOf([0,11],2),
      rowOf([0,11],3),
      rowOf([1,10],2),
      rowOf([2,3,4,5,6,7,8,9],3),
      empty(),empty()
    ] },

  { stage: 29, name: "Tic-Tac", ballSpeed: 5.9, paddleWidth: 72,
    grid: [
      rowOf([2,3,8,9],3),
      rowOf([2,3,8,9],2),
      fill(2),
      rowOf([2,3,8,9],3),
      rowOf([2,3,8,9],2),
      fill(2),
      rowOf([2,3,8,9],3),
      rowOf([2,3,8,9],2),
      empty(),empty()
    ] },

  { stage: 30, name: "30 Floors", ballSpeed: 6.0, paddleWidth: 70,
    grid: [
      fill(3),
      fill(3),
      fill(2),
      fill(2),
      fill(1),
      fill(2),
      fill(2),
      fill(3),
      fill(3),
      rowOf([5,6],4)
    ] },

  // === STAGE 31-50: Very Hard ===
  { stage: 31, name: "Stone Wall", ballSpeed: 6.0, paddleWidth: 70,
    grid: [
      fill(4),
      fill(3),
      fill(3),
      fill(2),
      fill(1),
      fill(2),
      fill(3),
      fill(3),
      fill(2),
      fill(1)
    ] },

  { stage: 32, name: "Invader", ballSpeed: 6.1, paddleWidth: 68,
    grid: [
      rowOf([2,9],3),
      rowOf([1,2,9,10],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],3),
      rowOf([2,4,5,6,7,9],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],3),
      rowOf([1,4,7,10],2),
      rowOf([2,3,8,9],2),
      empty(),empty(),empty()
    ] },

  { stage: 33, name: "X Marks", ballSpeed: 6.1, paddleWidth: 68,
    grid: [
      rowOf([0,1,10,11],3),
      rowOf([1,2,9,10],2),
      rowOf([2,3,8,9],3),
      rowOf([3,4,7,8],2),
      rowOf([4,5,6,7],3),
      rowOf([3,4,7,8],2),
      rowOf([2,3,8,9],3),
      rowOf([1,2,9,10],2),
      rowOf([0,1,10,11],3),
      empty()
    ] },

  { stage: 34, name: "Dungeon", ballSpeed: 6.2, paddleWidth: 66,
    grid: [
      fill(4),
      rowOf([0,5,6,11],3),
      rowOf([0,5,6,11],2),
      rowOf([0,11],3),
      fill(3),
      rowOf([0,11],2),
      rowOf([0,3,4,5,6,7,8,11],3),
      rowOf([0,11],2),
      fill(3),
      fill(4)
    ] },

  { stage: 35, name: "Midpoint", ballSpeed: 6.2, paddleWidth: 66,
    grid: [
      rowOf([5,6],4),
      rowOf([4,5,6,7],3),
      rowOf([3,4,5,6,7,8],3),
      rowOf([2,3,4,5,6,7,8,9],2),
      rowOf([1,2,3,4,5,6,7,8,9,10],2),
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],3),
      rowOf([1,2,3,4,5,6,7,8,9,10],2),
      rowOf([2,3,4,5,6,7,8,9],2),
      rowOf([3,4,5,6,7,8],3),
      rowOf([4,5,6,7],4)
    ] },

  { stage: 36, name: "Minefield", ballSpeed: 6.3, paddleWidth: 65,
    grid: [
      rowOf([1,4,7,10],4),
      rowOf([0,2,3,5,6,8,9,11],3),
      rowOf([1,4,7,10],4),
      rowOf([0,2,3,5,6,8,9,11],2),
      rowOf([1,4,7,10],3),
      rowOf([0,2,3,5,6,8,9,11],3),
      rowOf([1,4,7,10],4),
      rowOf([0,2,3,5,6,8,9,11],2),
      empty(),empty()
    ] },

  { stage: 37, name: "Canyon", ballSpeed: 6.3, paddleWidth: 64,
    grid: [
      fill(3),
      fill(3),
      rowOf([0,1,2,10,11],3),
      rowOf([0,1,11],2),
      rowOf([0,11],3),
      rowOf([0,11],2),
      rowOf([0,1,11],3),
      rowOf([0,1,2,10,11],2),
      fill(3),
      fill(4)
    ] },

  { stage: 38, name: "Blaze", ballSpeed: 6.4, paddleWidth: 63,
    grid: [
      rowOf([0,11],4),
      rowOf([1,10],3),
      rowOf([0,2,9,11],3),
      rowOf([1,3,8,10],2),
      rowOf([0,2,4,7,9,11],3),
      rowOf([1,3,5,6,8,10],2),
      rowOf([0,2,4,7,9,11],3),
      rowOf([1,3,8,10],2),
      rowOf([0,2,9,11],3),
      rowOf([1,10],4)
    ] },

  { stage: 39, name: "Nuclear", ballSpeed: 6.4, paddleWidth: 62,
    grid: [
      fill(3),
      fill(3),
      fill(2),
      fill(3),
      fill(3),
      fill(2),
      fill(3),
      fill(3),
      fill(2),
      fill(4)
    ] },

  { stage: 40, name: "Halfway!", ballSpeed: 6.5, paddleWidth: 60,
    grid: [
      fill(4),
      fill(3),
      fill(2),
      fill(3),
      rowOf([0,11],4),
      rowOf([0,5,6,11],3),
      fill(3),
      fill(2),
      fill(3),
      fill(4)
    ] },

  // === STAGE 41-60: Expert ===
  { stage: 41, name: "Siege", ballSpeed: 6.5, paddleWidth: 60,
    grid: [
      fill(4),
      fill(4),
      fill(3),
      rowOf([0,11],4),
      rowOf([0,11],3),
      rowOf([0,11],2),
      rowOf([0,11],3),
      fill(3),
      fill(4),
      fill(4)
    ] },

  { stage: 42, name: "Ricochet", ballSpeed: 6.6, paddleWidth: 58,
    grid: [
      rowOf([0,1,2,3],4),
      rowOf([3,4,5,6],3),
      rowOf([6,7,8,9],4),
      rowOf([9,10,11],3),
      rowOf([6,7,8,9],4),
      rowOf([3,4,5,6],3),
      rowOf([0,1,2,3],4),
      rowOf([3,4,5,6],3),
      rowOf([6,7,8,9],4),
      rowOf([9,10,11],3)
    ] },

  { stage: 43, name: "Blizzard", ballSpeed: 6.6, paddleWidth: 57,
    grid: [
      fill(3),
      rowOf([0,2,4,6,8,10],4),
      fill(3),
      rowOf([1,3,5,7,9,11],4),
      fill(3),
      rowOf([0,2,4,6,8,10],4),
      fill(3),
      rowOf([1,3,5,7,9,11],4),
      fill(2),
      empty()
    ] },

  { stage: 44, name: "Typhoon", ballSpeed: 6.7, paddleWidth: 56,
    grid: [
      fill(4),
      rowOf([1,2,3,4,5,6,7,8,9,10],3),
      rowOf([2,3,4,5,6,7,8,9],4),
      rowOf([3,4,5,6,7,8],3),
      rowOf([4,5,6,7],4),
      rowOf([3,4,5,6,7,8],3),
      rowOf([2,3,4,5,6,7,8,9],4),
      rowOf([1,2,3,4,5,6,7,8,9,10],3),
      fill(4),
      empty()
    ] },

  { stage: 45, name: "45 Storm", ballSpeed: 6.7, paddleWidth: 56,
    grid: [
      fill(4),
      fill(4),
      fill(3),
      fill(4),
      fill(3),
      fill(4),
      fill(3),
      fill(4),
      fill(4),
      rowOf([5,6],4)
    ] },

  { stage: 46, name: "Web", ballSpeed: 6.8, paddleWidth: 55,
    grid: [
      rowOf([0,5,6,11],4),
      rowOf([1,4,7,10],3),
      rowOf([2,3,8,9],4),
      rowOf([0,5,6,11],3),
      rowOf([1,4,7,10],4),
      rowOf([2,3,8,9],3),
      rowOf([0,5,6,11],4),
      rowOf([1,4,7,10],3),
      rowOf([2,3,8,9],4),
      empty()
    ] },

  { stage: 47, name: "Avalanche", ballSpeed: 6.8, paddleWidth: 54,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      fill(3),
      fill(3),
      fill(2),
      fill(3),
      fill(4),
      fill(4),
      fill(4)
    ] },

  { stage: 48, name: "Magma", ballSpeed: 6.9, paddleWidth: 53,
    grid: [
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],4),
      rowOf([1,2,3,4,5,6,7,8,9,10],4),
      rowOf([2,3,4,5,6,7,8,9],3),
      rowOf([3,4,5,6,7,8],3),
      rowOf([4,5,6,7],4),
      rowOf([3,4,5,6,7,8],3),
      rowOf([2,3,4,5,6,7,8,9],4),
      rowOf([1,2,3,4,5,6,7,8,9,10],3),
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],4),
      empty()
    ] },

  { stage: 49, name: "49ers", ballSpeed: 7.0, paddleWidth: 52,
    grid: [
      fill(4),
      rowOf([0,11],4),
      rowOf([0,4,5,6,7,11],4),
      rowOf([0,4,11],3),
      rowOf([0,4,11],4),
      rowOf([0,4,11],3),
      rowOf([0,4,5,6,7,11],4),
      rowOf([0,11],4),
      fill(4),
      empty()
    ] },

  { stage: 50, name: "HALFWAY BOSS", ballSpeed: 7.0, paddleWidth: 50,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      fill(3),
      fill(4),
      fill(3),
      fill(4),
      fill(4),
      fill(4),
      fill(4)
    ] },

  // === STAGE 51-70: Brutal ===
  { stage: 51, name: "Gauntlet", ballSpeed: 7.1, paddleWidth: 50,
    grid: [
      fill(4),
      fill(4),
      fill(3),
      fill(3),
      fill(4),
      fill(4),
      rowOf([0,11],4),
      rowOf([0,11],3),
      fill(4),
      fill(4)
    ] },

  { stage: 52, name: "Thunder", ballSpeed: 7.1, paddleWidth: 48,
    grid: [
      rowOf([5,6,7,8,9,10,11],4),
      rowOf([4,5,6,7,8,9,10],3),
      rowOf([3,4,5,6,7,8,9],4),
      rowOf([2,3,4,5,6,7,8],3),
      rowOf([1,2,3,4,5,6,7],4),
      rowOf([2,3,4,5,6,7,8],3),
      rowOf([3,4,5,6,7,8,9],4),
      rowOf([4,5,6,7,8,9,10],3),
      rowOf([5,6,7,8,9,10,11],4),
      empty()
    ] },

  { stage: 53, name: "Ramparts", ballSpeed: 7.2, paddleWidth: 47,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      rowOf([0,3,4,7,8,11],4),
      rowOf([0,3,7,11],3),
      rowOf([0,3,7,11],4),
      rowOf([0,3,4,7,8,11],3),
      fill(4),
      fill(4),
      fill(4)
    ] },

  { stage: 54, name: "Black Hole", ballSpeed: 7.2, paddleWidth: 46,
    grid: [
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],4),
      rowOf([0,1,2,3,8,9,10,11],4),
      rowOf([0,1,10,11],4),
      rowOf([0,11],3),
      rowOf([0,11],4),
      rowOf([0,11],3),
      rowOf([0,1,10,11],4),
      rowOf([0,1,2,3,8,9,10,11],4),
      rowOf([0,1,2,3,4,5,6,7,8,9,10,11],4),
      empty()
    ] },

  { stage: 55, name: "Pinball Pro", ballSpeed: 7.3, paddleWidth: 46,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      fill(3),
      fill(4),
      fill(4),
      fill(4),
      fill(3),
      fill(4),
      fill(4)
    ] },

  { stage: 56, name: "Colossus", ballSpeed: 7.3, paddleWidth: 45,
    grid: [
      fill(4),
      rowOf([0,5,6,11],4),
      rowOf([0,4,7,11],3),
      rowOf([0,3,8,11],4),
      rowOf([0,2,9,11],3),
      rowOf([0,2,9,11],4),
      rowOf([0,3,8,11],3),
      rowOf([0,4,7,11],4),
      rowOf([0,5,6,11],3),
      fill(4)
    ] },

  { stage: 57, name: "Titan", ballSpeed: 7.4, paddleWidth: 44,
    grid: [
      fill(4),
      fill(4),
      rowOf([0,11],4),
      rowOf([0,3,8,11],4),
      rowOf([0,3,4,7,8,11],3),
      rowOf([0,3,4,7,8,11],4),
      rowOf([0,3,8,11],3),
      rowOf([0,11],4),
      fill(4),
      fill(4)
    ] },

  { stage: 58, name: "Ice Castle", ballSpeed: 7.4, paddleWidth: 43,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      rowOf([0,11],4),
      rowOf([0,11],4),
      fill(4),
      fill(4),
      fill(4),
      fill(4)
    ] },

  { stage: 59, name: "Permafrost", ballSpeed: 7.5, paddleWidth: 42,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(3),
      fill(4),
      fill(4),
      fill(4),
      fill(4)
    ] },

  { stage: 60, name: "60 Shockwave", ballSpeed: 7.5, paddleWidth: 42,
    grid: [
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      fill(4),
      rowOf([5,6],4)
    ] },

  // === STAGE 61-80: Infernal ===
  { stage: 61, name: "Inferno", ballSpeed: 7.6, paddleWidth: 40,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 62, name: "Hellfire", ballSpeed: 7.6, paddleWidth: 40,
    grid: [
      fill(4),fill(4),fill(4),
      rowOf([0,11],4),rowOf([0,11],4),
      rowOf([0,5,6,11],4),rowOf([0,5,6,11],4),
      fill(4),fill(4),fill(4)
    ] },

  { stage: 63, name: "Obsidian", ballSpeed: 7.7, paddleWidth: 39,
    grid: [
      fill(4),fill(4),fill(4),fill(4),
      rowOf([0,5,6,11],3),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 64, name: "Volcanus", ballSpeed: 7.7, paddleWidth: 38,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 65, name: "Depth Charge", ballSpeed: 7.8, paddleWidth: 38,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      rowOf([0,11],4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 66, name: "Abyss", ballSpeed: 7.8, paddleWidth: 37,
    grid: [
      fill(4),fill(4),fill(4),fill(4),
      rowOf([0,11],3),rowOf([0,11],3),
      fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 67, name: "Magnet Field", ballSpeed: 7.9, paddleWidth: 36,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 68, name: "Plasma Storm", ballSpeed: 7.9, paddleWidth: 36,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      rowOf([1,2,3,4,5,6,7,8,9,10],3),
      fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 69, name: "Nova", ballSpeed: 8.0, paddleWidth: 35,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 70, name: "70 Supernova", ballSpeed: 8.0, paddleWidth: 35,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  // === STAGE 71-85: Apocalyptic ===
  { stage: 71, name: "Apocalypse", ballSpeed: 8.1, paddleWidth: 34,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 72, name: "Ragnarok", ballSpeed: 8.1, paddleWidth: 34,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 73, name: "Extinction", ballSpeed: 8.2, paddleWidth: 33,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 74, name: "Dark Matter", ballSpeed: 8.2, paddleWidth: 32,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 75, name: "75 Singularity", ballSpeed: 8.3, paddleWidth: 32,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 76, name: "Entropy", ballSpeed: 8.3, paddleWidth: 31,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 77, name: "Chaos Engine", ballSpeed: 8.4, paddleWidth: 30,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 78, name: "Nemesis", ballSpeed: 8.4, paddleWidth: 30,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 79, name: "Oblivion", ballSpeed: 8.5, paddleWidth: 29,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 80, name: "Void Crusher", ballSpeed: 8.5, paddleWidth: 28,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  // === STAGE 81-100: LEGENDARY ===
  { stage: 81, name: "Legend Begins", ballSpeed: 8.6, paddleWidth: 28,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 82, name: "Iron Will", ballSpeed: 8.6, paddleWidth: 27,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 83, name: "Steel Mind", ballSpeed: 8.7, paddleWidth: 26,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 84, name: "Diamond Heart", ballSpeed: 8.7, paddleWidth: 26,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 85, name: "85 Pinnacle", ballSpeed: 8.8, paddleWidth: 25,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 86, name: "Ascendant", ballSpeed: 8.8, paddleWidth: 24,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 87, name: "Transcendent", ballSpeed: 9.0, paddleWidth: 24,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 88, name: "Omnipotent", ballSpeed: 9.0, paddleWidth: 23,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 89, name: "Godlike", ballSpeed: 9.1, paddleWidth: 22,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 90, name: "90 Immortal", ballSpeed: 9.2, paddleWidth: 22,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 91, name: "Supreme", ballSpeed: 9.2, paddleWidth: 21,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 92, name: "Invincible", ballSpeed: 9.3, paddleWidth: 20,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 93, name: "Absolute", ballSpeed: 9.3, paddleWidth: 20,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 94, name: "Infinite Power", ballSpeed: 9.4, paddleWidth: 19,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 95, name: "95 Eternity", ballSpeed: 9.5, paddleWidth: 18,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 96, name: "Cosmos", ballSpeed: 9.5, paddleWidth: 18,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 97, name: "Universe", ballSpeed: 9.6, paddleWidth: 17,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 98, name: "Beyond Reality", ballSpeed: 9.7, paddleWidth: 16,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 99, name: "Final Test", ballSpeed: 9.8, paddleWidth: 15,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },

  { stage: 100, name: "ULTIMATE BOSS", ballSpeed: 10.0, paddleWidth: 14,
    grid: [
      fill(4),fill(4),fill(4),fill(4),fill(4),
      fill(4),fill(4),fill(4),fill(4),fill(4)
    ] },
];
