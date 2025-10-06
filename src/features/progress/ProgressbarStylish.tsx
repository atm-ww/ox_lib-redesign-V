import React from 'react';
import { Box, createStyles, Text, keyframes } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

// Progress bar fill animation
const progressFill = keyframes({
  '0%': { width: '0%' },
  '100%': { width: '100%' },
});

// Neon light effect
const neonGlow = keyframes({
  '0%, 100%': {
    boxShadow: `
      0 0 5px rgba(0, 255, 255, 0.5),
      0 0 10px rgba(0, 255, 255, 0.5),
      0 0 15px rgba(0, 255, 255, 0.5),
      0 0 20px rgba(0, 255, 255, 0.5)
    `,
  },
  '50%': {
    boxShadow: `
      0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(0, 255, 255, 0.8),
      0 0 30px rgba(0, 255, 255, 0.8),
      0 0 40px rgba(0, 255, 255, 0.8)
    `,
  },
});

// Shimmer effect
const shimmer = keyframes({
  '0%': {
    transform: 'translateX(-100%) skewX(-15deg)',
  },
  '100%': {
    transform: 'translateX(200%) skewX(-15deg)',
  },
});

// Text glow effect
const textGlow = keyframes({
  '0%, 100%': {
    textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6)',
  },
  '50%': {
    textShadow: '0 0 20px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.8)',
  },
});

const useStyles = createStyles(() => ({
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
    gap: 8,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 700,
    textAlign: 'center',
    animation: `${textGlow} 2s ease-in-out infinite`,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  progressContainer: {
    position: 'relative',
    width: 400,
    height: 24,
  },
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '2px solid rgba(0, 255, 255, 0.6)',
    overflow: 'hidden',
    position: 'relative',
    animation: `${neonGlow} 3s ease-in-out infinite`,
    // Add inner border effect
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 2,
      left: 2,
      right: 2,
      bottom: 2,
      border: '1px solid rgba(0, 255, 255, 0.3)',
      borderRadius: 8,
      pointerEvents: 'none',
    },
    // Add background grid texture
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '20px 4px',
      opacity: 0.3,
      pointerEvents: 'none',
    },
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: `
      linear-gradient(90deg, 
        rgba(0, 255, 255, 0.7) 0%,
        rgba(0, 255, 255, 0.9) 30%,
        rgba(0, 255, 255, 1) 70%,
        rgba(0, 200, 255, 1) 100%
      )
    `,
    borderRadius: 10,
    boxShadow: `
      0 0 15px rgba(0, 255, 255, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2)
    `,
    overflow: 'hidden',
    // Shimmer effect
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '30%',
      height: '100%',
      background: `
        linear-gradient(90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.6) 50%,
          transparent 100%
        )
      `,
      animation: `${shimmer} 2s ease-in-out infinite`,
    },
    // Top highlight
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
      borderRadius: '10px 10px 0 0',
    },
  },
  percentageDisplay: {
    position: 'absolute',
    top: '50%',
    right: 8,
    transform: 'translateY(-50%)',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 700,
    textShadow: '0 0 8px rgba(0, 0, 0, 0.8)',
    fontFamily: 'monospace',
  },
  // Responsive design
  '@media (max-width: 768px)': {
    progressContainer: {
      width: 320,
      height: 20,
    },
    label: {
      fontSize: 14,
    },
    percentageDisplay: {
      fontSize: 10,
    },
  },
}));

const ProgressbarStylish: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useNuiEvent('progressCancel', () => {
    setVisible(false);
    setProgress(0);
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
    
    // Calculate progress percentage
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / data.duration) * 100, 100);
      setProgress(Math.round(newProgress));
      
      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };
    requestAnimationFrame(updateProgress);
  });

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <>
          {label && (
            <Box className={classes.labelContainer}>
              <Text className={classes.label}>{label}</Text>
            </Box>
          )}
          <Box className={classes.progressContainer}>
            <Box className={classes.container}>
              <Box className={classes.progressTrack} />
              <Box
                className={classes.bar}
                onAnimationEnd={() => setVisible(false)}
                sx={{
                  animation: `${progressFill} linear forwards`,
                  animationDuration: `${duration}ms`,
                }}
              />
              <Text className={classes.percentageDisplay}>{progress}%</Text>
            </Box>
          </Box>
        </>
      </ScaleFade>
    </Box>
  );
};

export default ProgressbarStylish;