import React from 'react';
import { createStyles, keyframes, Stack, Text, Box } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

// Circle progress animation
const circleProgress = keyframes({
  '0%': {
    strokeDasharray: '0 283', // 2 * π * 45 ≈ 283
    transform: 'rotate(-90deg)',
  },
  '100%': {
    strokeDasharray: '283 283',
    transform: 'rotate(-90deg)',
  },
});

// Pulse glow effect
const pulseGlow = keyframes({
  '0%, 100%': {
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.6))',
  },
  '50%': {
    filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.9))',
  },
});

// Rotating glow
const rotateGlow = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    width: 120,
    height: 120,
    transform: 'rotate(-90deg)',
    animation: `${pulseGlow} 2s ease-in-out infinite`,
  },
  progressTrack: {
    fill: 'none',
    stroke: 'rgba(0, 0, 0, 0.3)',
    strokeWidth: 4,
    strokeLinecap: 'round',
  },
  progressBar: {
    fill: 'none',
    stroke: 'url(#progressGradient)',
    strokeWidth: 6,
    strokeLinecap: 'round',
    strokeDasharray: '0 283',
    animation: `${circleProgress} linear forwards`,
    animationDuration: `${params.duration}ms`,
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))',
  },
  backgroundGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: `
      radial-gradient(circle,
        rgba(0, 255, 255, 0.1) 0%,
        rgba(0, 255, 255, 0.05) 50%,
        transparent 70%
      )
    `,
    animation: `${rotateGlow} 4s linear infinite`,
    zIndex: -1,
  },
  contentWrapper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Roboto Mono, monospace',
    textShadow: `
      0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(0, 255, 255, 0.6),
      1px 1px 2px rgba(0, 0, 0, 0.8)
    `,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 1,
  },
  percentage: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: -2,
  },
  label: {
    textAlign: 'center',
    textShadow: '0 0 8px rgba(0, 255, 255, 0.6), 1px 1px 2px rgba(0, 0, 0, 0.8)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 14,
    marginTop: 8,
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    padding: 0,
    backgroundColor: 'transparent',
  },
  // Responsive design
  '@media (max-width: 768px)': {
    progressWrapper: {
      width: 100,
      height: 100,
    },
    progressSvg: {
      width: 100,
      height: 100,
    },
    backgroundGlow: {
      width: 120,
      height: 120,
    },
    value: {
      fontSize: 18,
    },
    label: {
      fontSize: 12,
      maxWidth: 150,
    },
  },
}));

const CircleProgressbarEnhanced: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <Stack spacing={0} className={classes.container}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Stack spacing={0} align="center" className={classes.wrapper}>
          <Box className={classes.progressWrapper}>
            <Box className={classes.backgroundGlow} />
            <svg className={classes.progressSvg}>
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0, 255, 255, 0.8)" />
                  <stop offset="50%" stopColor="rgba(0, 255, 255, 1)" />
                  <stop offset="100%" stopColor="rgba(0, 200, 255, 1)" />
                </linearGradient>
              </defs>
              <circle
                className={classes.progressTrack}
                cx="60"
                cy="60"
                r="45"
              />
              <circle
                className={classes.progressBar}
                cx="60"
                cy="60"
                r="45"
                onAnimationEnd={() => setVisible(false)}
              />
            </svg>
            <Box className={classes.contentWrapper}>
              <Text className={classes.value}>
                {value}
                <Text component="span" className={classes.percentage}>%</Text>
              </Text>
            </Box>
          </Box>
          {label && <Text className={classes.label}>{label}</Text>}
        </Stack>
      </ScaleFade>
    </Stack>
  );
};

export default CircleProgressbarEnhanced;