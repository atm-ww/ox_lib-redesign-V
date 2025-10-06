import { useRef, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import ModernIndicator from './ModernIndicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box, createStyles, Text, keyframes } from '@mantine/core';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 60 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 60,
  medium: 45,
  hard: 30,
};

// Pulse animation
const pulse = keyframes({
  '0%, 100%': {
    boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)',
  },
  '50%': {
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.4)',
  },
});

// Rotating ring
const rotateRing = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

// Key blinking
const keyBlink = keyframes({
  '0%, 100%': {
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    color: '#00ffff',
    textShadow: '0 0 10px #00ffff',
  },
  '50%': {
    backgroundColor: 'rgba(0, 255, 255, 0.4)',
    color: '#ffffff',
    textShadow: '0 0 15px #00ffff, 0 0 25px #00ffff',
  },
});

const useStyles = createStyles((theme, params: { difficultyOffset: number; difficulty: string }) => ({
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
  },
  skillCheckWrapper: {
    position: 'relative',
    width: 400,
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: '50%',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    animation: `${rotateRing} 8s linear infinite, ${pulse} 2s ease-in-out infinite`,
  },
  svg: {
    width: 350,
    height: 350,
    zIndex: 2,
  },
  track: {
    fill: 'transparent',
    stroke: 'rgba(255, 255, 255, 0.1)',
    strokeWidth: 12,
    r: 60,
    cx: 175,
    cy: 175,
    strokeDasharray: circleCircumference,
    filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.2))',
  },
  skillArea: {
    fill: 'transparent',
    stroke: params.difficulty === 'easy' ? '#00ff00' : 
           params.difficulty === 'medium' ? '#ffaa00' : '#ff0000',
    strokeWidth: 16,
    r: 60,
    cx: 175,
    cy: 175,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - (Math.PI * 60 * params.difficultyOffset) / 180,
    filter: `drop-shadow(0 0 10px ${
      params.difficulty === 'easy' ? 'rgba(0, 255, 0, 0.8)' : 
      params.difficulty === 'medium' ? 'rgba(255, 170, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)'
    })`,
    strokeLinecap: 'round',
  },
  indicator: {
    stroke: '#00ffff',
    strokeWidth: 8,
    fill: 'transparent',
    r: 60,
    cx: 175,
    cy: 175,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - 8,
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 1))',
    strokeLinecap: 'round',
  },
  centerArea: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.8)',
    border: '2px solid rgba(0, 255, 255, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  keyButton: {
    fontSize: 32,
    fontWeight: 900,
    fontFamily: 'monospace',
    animation: `${keyBlink} 1.5s ease-in-out infinite`,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: params.difficulty === 'easy' ? '#00ff00' : 
           params.difficulty === 'medium' ? '#ffaa00' : '#ff0000',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  progressRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    animation: `${rotateRing} 12s linear infinite reverse`,
  },
  // Decorative light dots
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 20,
      left: 20,
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: '#00ffff',
      boxShadow: '0 0 10px #00ffff',
      animation: `${rotateRing} 6s linear infinite`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: '#00ffff',
      boxShadow: '0 0 8px #00ffff',
      animation: `${rotateRing} 8s linear infinite reverse`,
    },
  },
}));

const SkillCheckModern: React.FC = () => {
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
  const { classes } = useStyles({ 
    difficultyOffset: skillCheck.difficultyOffset,
    difficulty: difficultyString
  });

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
        <Box className={classes.outerRing} />
        <Box className={classes.progressRing} />
        <Box className={classes.decorativeElements} />
        
        <svg className={classes.svg}>
          <circle className={classes.track} />
          <circle 
            transform={`rotate(${skillCheck.angle}, 175, 175)`} 
            className={classes.skillArea} 
          />
          <ModernIndicator
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
        
        <Box className={classes.centerArea}>
          <Text className={classes.keyButton}>
            {skillCheck.key.toUpperCase()}
          </Text>
          <Text className={classes.difficultyText}>
            {difficultyString}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SkillCheckModern;