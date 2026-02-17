export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type SnakeStatus = 'running' | 'paused' | 'gameover';

export interface SnakeState {
  snake: Position[];
  direction: Direction;
  pendingDirection: Direction;
  food: Position | null;
  score: number;
  status: SnakeStatus;
}

type RandomFn = () => number;

export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;
export const TICK_MS = 120;

const INITIAL_SNAKE: Position[] = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

const OFFSETS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const createInitialSnakeState = (randomFn: RandomFn = Math.random): SnakeState => {
  const snake = [...INITIAL_SNAKE];
  const food = spawnFood(snake, randomFn);

  return {
    snake,
    direction: 'RIGHT',
    pendingDirection: 'RIGHT',
    food,
    score: 0,
    status: 'running',
  };
};

export const restartSnakeState = (randomFn: RandomFn = Math.random): SnakeState =>
  createInitialSnakeState(randomFn);

export const togglePause = (state: SnakeState): SnakeState => {
  if (state.status === 'gameover') {
    return state;
  }

  return {
    ...state,
    status: state.status === 'running' ? 'paused' : 'running',
  };
};

export const queueDirection = (state: SnakeState, nextDirection: Direction): SnakeState => {
  if (isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return {
    ...state,
    pendingDirection: nextDirection,
  };
};

export const advanceSnakeState = (
  state: SnakeState,
  randomFn: RandomFn = Math.random
): SnakeState => {
  if (state.status !== 'running' || state.snake.length === 0) {
    return state;
  }

  const direction = isOppositeDirection(state.direction, state.pendingDirection)
    ? state.direction
    : state.pendingDirection;
  const nextHead = move(state.snake[0], direction);
  const ateFood = state.food !== null && isSamePosition(nextHead, state.food);
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);

  if (isOutOfBounds(nextHead) || hasCollision(collisionBody, nextHead)) {
    return {
      ...state,
      direction,
      pendingDirection: direction,
      status: 'gameover',
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!ateFood) {
    nextSnake.pop();
  }

  const nextFood = ateFood ? spawnFood(nextSnake, randomFn) : state.food;
  const hasWon = ateFood && nextFood === null;

  return {
    ...state,
    snake: nextSnake,
    direction,
    pendingDirection: direction,
    food: nextFood,
    score: ateFood ? state.score + 1 : state.score,
    status: hasWon ? 'gameover' : state.status,
  };
};

export const spawnFood = (snake: Position[], randomFn: RandomFn = Math.random): Position | null => {
  const occupied = new Set(snake.map(toCellKey));
  const freeCells: Position[] = [];

  for (let y = 0; y < GRID_HEIGHT; y += 1) {
    for (let x = 0; x < GRID_WIDTH; x += 1) {
      const cell = { x, y };
      if (!occupied.has(toCellKey(cell))) {
        freeCells.push(cell);
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const rawIndex = Math.floor(randomFn() * freeCells.length);
  const index = Math.max(0, Math.min(rawIndex, freeCells.length - 1));
  return freeCells[index];
};

const move = (position: Position, direction: Direction): Position => {
  const offset = OFFSETS[direction];
  return {
    x: position.x + offset.x,
    y: position.y + offset.y,
  };
};

const hasCollision = (snake: Position[], head: Position): boolean =>
  snake.some((segment) => isSamePosition(segment, head));

const isSamePosition = (first: Position, second: Position): boolean =>
  first.x === second.x && first.y === second.y;

const isOutOfBounds = (position: Position): boolean =>
  position.x < 0 || position.x >= GRID_WIDTH || position.y < 0 || position.y >= GRID_HEIGHT;

const toCellKey = (position: Position): string => `${position.x}:${position.y}`;

const isOppositeDirection = (current: Direction, next: Direction): boolean =>
  (current === 'UP' && next === 'DOWN') ||
  (current === 'DOWN' && next === 'UP') ||
  (current === 'LEFT' && next === 'RIGHT') ||
  (current === 'RIGHT' && next === 'LEFT');
