import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  Direction,
  GRID_HEIGHT,
  GRID_WIDTH,
  SnakeState,
  TICK_MS,
  advanceSnakeState,
  createInitialSnakeState,
  queueDirection,
  restartSnakeState,
  togglePause,
} from '../lib/snake-game';

const CELL_KEYS = Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => {
  const x = index % GRID_WIDTH;
  const y = Math.floor(index / GRID_WIDTH);
  return `${x}:${y}`;
});

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  W: 'UP',
  a: 'LEFT',
  A: 'LEFT',
  s: 'DOWN',
  S: 'DOWN',
  d: 'RIGHT',
  D: 'RIGHT',
};

const getCellKey = (x: number, y: number): string => `${x}:${y}`;

const getStatusLabel = (status: SnakeState['status']): string => {
  if (status === 'paused') {
    return 'Pausa';
  }
  if (status === 'gameover') {
    return 'Game Over';
  }
  return 'In gioco';
};

const SnakePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [state, setState] = useState<SnakeState>(() => createInitialSnakeState());
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    if (state.score > bestScore) {
      setBestScore(state.score);
    }
  }, [state.score, bestScore]);

  useEffect(() => {
    if (state.status !== 'running') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setState((previousState) => advanceSnakeState(previousState));
    }, TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [state.status]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];

      if (direction) {
        event.preventDefault();
        setState((previousState) => queueDirection(previousState, direction));
        return;
      }

      if (event.key === ' ' || event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        setState((previousState) => togglePause(previousState));
        return;
      }

      if (event.key === 'r' || event.key === 'R' || event.key === 'Enter') {
        event.preventDefault();
        setState(restartSnakeState());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const snakeCells = useMemo(() => {
    const cells = new Set<string>();
    state.snake.forEach((segment) => cells.add(getCellKey(segment.x, segment.y)));
    return cells;
  }, [state.snake]);

  const headKey = state.snake[0] ? getCellKey(state.snake[0].x, state.snake[0].y) : '';
  const foodKey = state.food ? getCellKey(state.food.x, state.food.y) : '';

  const handleDirection = (direction: Direction) => {
    setState((previousState) => queueDirection(previousState, direction));
  };

  const handlePause = () => {
    setState((previousState) => togglePause(previousState));
  };

  const handleRestart = () => {
    setState(restartSnakeState());
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 680, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Snake
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
          justifyContent="space-between"
        >
          <Typography variant="body1">Score: {state.score}</Typography>
          <Typography variant="body1">Best: {bestScore}</Typography>
          <Typography variant="body1">Stato: {getStatusLabel(state.status)}</Typography>
        </Stack>

        <Box className="snake-grid">
          {CELL_KEYS.map((cellKey) => {
            let className = 'snake-cell';

            if (cellKey === foodKey) {
              className += ' snake-food';
            } else if (snakeCells.has(cellKey)) {
              className += cellKey === headKey ? ' snake-head' : ' snake-body';
            }

            return <Box key={cellKey} className={className} />;
          })}
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleRestart}>
            Restart
          </Button>
          <Button variant="outlined" onClick={handlePause} disabled={state.status === 'gameover'}>
            {state.status === 'paused' ? 'Riprendi' : 'Pausa'}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Controlli tastiera: frecce o WASD. `P` o spazio per pausa. `R` o Invio per restart.
        </Typography>

        {state.status === 'gameover' && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Partita terminata. Premi Restart per una nuova partita.
          </Typography>
        )}

        {isMobile && (
          <Box className="snake-pad">
            <Button variant="outlined" onClick={() => handleDirection('UP')}>
              ↑
            </Button>
            <Box className="snake-pad-row">
              <Button variant="outlined" onClick={() => handleDirection('LEFT')}>
                ←
              </Button>
              <Box className="snake-pad-spacer" />
              <Button variant="outlined" onClick={() => handleDirection('RIGHT')}>
                →
              </Button>
            </Box>
            <Button variant="outlined" onClick={() => handleDirection('DOWN')}>
              ↓
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SnakePage;
