import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import CleanIndicator from './CleanIndicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles, Text, keyframes } from '@mantine/core';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 80 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 60,
  medium: 45,
  hard: 30,
};

// Simple pulse effect
const subtlePulse = keyframes({
  '0%, 100%': {
    opacity: 0.8,
  },
  '50%': {
    opacity: 1,
  },
});

// Key prompt animation
const keyPrompt = keyframes({
  '0%, 100%': {
    transform: 'scale(1)',
    textShadow: '0 0 10px rgba(0, 255, 255, 0.6)',
  },
  '50%': {
    transform: 'scale(1.1)',
    textShadow: '0 0 20px rgba(0, 255, 255, 0.9)',
  },
});

const useStyles = createStyles((theme, params: { difficulty: string }) => ({
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  skillCheckWrapper: {
    position: 'relative',
    width: 300,
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    width: 300,
    height: 300,
  },
  track: {
    fill: 'transparent',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 8,
    r: 80,
    cx: 150,
    cy: 150,
    strokeDasharray: circleCircumference,
  },
  skillArea: {
    fill: 'transparent',
    stroke: params.difficulty === 'easy' ? '#4ade80' : 
           params.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
    strokeWidth: 12,
    r: 80,
    cx: 150,
    cy: 150,
    strokeDasharray: circleCircumference,
    strokeLinecap: 'round',
    animation: `${subtlePulse} 2s ease-in-out infinite`,
  },
  indicator: {
    stroke: '#00d9ff',
    strokeWidth: 6,
    fill: 'transparent',
    r: 80,
    cx: 150,
    cy: 150,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - 12,
    strokeLinecap: 'round',
    filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))',
  },
  centerButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.9)',
    border: '2px solid rgba(0, 217, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  keyText: {
    fontSize: 28,
    fontWeight: 700,
    color: '#00d9ff',
    fontFamily: 'monospace',
    animation: `${keyPrompt} 1.5s ease-in-out infinite`,
  },
  difficultyIndicator: {
    position: 'absolute',
    top: -40,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 14,
    fontWeight: 600,
    color: params.difficulty === 'easy' ? '#4ade80' : 
           params.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
}));

const SkillCheckClean: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 60,
    difficulty: 'easy',
    key: 'e',
  });
  
  const difficultyString = typeof skillCheck.difficulty === 'string' ? skillCheck.difficulty : 'custom';
  const { classes } = useStyles({ difficulty: difficultyString });

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';
    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    setSkillCheck((prev) => ({
      ...prev,
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  if (!visible) return null;

  return (
    <Box className={classes.container}>
      <Box className={classes.skillCheckWrapper}>
        <Text className={classes.difficultyIndicator}>
          {difficultyString}
        </Text>
        
        <svg className={classes.svg}>
          <circle className={classes.track} />
          <circle 
            transform={`rotate(${skillCheck.angle}, 150, 150)`} 
            className={classes.skillArea}
            style={{
              strokeDashoffset: circleCircumference - (Math.PI * 80 * skillCheck.difficultyOffset) / 180,
            }}
          />
          <CleanIndicator
            angle={skillCheck.angle}
            offset={skillCheck.difficultyOffset}
            multiplier={
              skillCheck.difficulty === 'easy'
                ? 1
                : skillCheck.difficulty === 'medium'
                ? 1.5
                : skillCheck.difficulty === 'hard'
                ? 1.75
                : skillCheck.difficulty.speedMultiplier
            }
            handleComplete={handleComplete}
            className={classes.indicator}
            skillCheck={skillCheck}
          />
        </svg>
        
        <Box className={classes.centerButton}>
          <Text className={classes.keyText}>
            {skillCheck.key.toUpperCase()}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SkillCheckClean;