import React from 'react';
import { createStyles, keyframes, Stack, Text, Box } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

// Circle progress animation - fixed version
const circleProgress = keyframes({
  '0%': {
    strokeDasharray: '0 283',
  },
  '100%': {
    strokeDasharray: '283 0',
  },
});

// Rotation animation
const rotate = keyframes({
  '0%': {
    transform: 'rotate(-90deg)',
  },
  '100%': {
    transform: 'rotate(270deg)',
  },
});

// Pulse glow
const pulseGlow = keyframes({
  '0%, 100%': {
    boxShadow: `
      0 0 20px rgba(0, 255, 255, 0.4),
      0 0 40px rgba(0, 255, 255, 0.2),
      inset 0 0 20px rgba(0, 255, 255, 0.1)
    `,
  },
  '50%': {
    boxShadow: `
      0 0 30px rgba(0, 255, 255, 0.6),
      0 0 60px rgba(0, 255, 255, 0.4),
      inset 0 0 30px rgba(0, 255, 255, 0.2)
    `,
  },
});

// Number counting animation
const numberGlow = keyframes({
  '0%, 100%': {
    textShadow: `
      0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(0, 255, 255, 0.6),
      0 0 30px rgba(0, 255, 255, 0.4)
    `,
  },
  '50%': {
    textShadow: `
      0 0 15px rgba(0, 255, 255, 1),
      0 0 30px rgba(0, 255, 255, 0.8),
      0 0 45px rgba(0, 255, 255, 0.6)
    `,
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
    flexDirection: 'column',
    gap: 16,
  },
  progressWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: `
      conic-gradient(
        from 0deg,
        rgba(0, 255, 255, 0.1) 0deg,
        rgba(0, 255, 255, 0.3) 90deg,
        rgba(0, 255, 255, 0.1) 180deg,
        rgba(0, 255, 255, 0.05) 270deg,
        rgba(0, 255, 255, 0.1) 360deg
      )
    `,
    animation: `${rotate} 4s linear infinite, ${pulseGlow} 2s ease-in-out infinite`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,
      borderRadius: '50%',
      background: 'rgba(0, 0, 0, 0.8)',
    },
  },
  progressSvg: {
    width: 120,
    height: 120,
    transform: 'rotate(-90deg)',
    zIndex: 2,
  },
  progressTrack: {
    fill: 'none',
    stroke: 'rgba(0, 0, 0, 0.3)',
    strokeWidth: 3,
    strokeLinecap: 'round',
  },
  progressBar: {
    fill: 'none',
    stroke: 'url(#modernGradient)',
    strokeWidth: 6,
    strokeLinecap: 'round',
    strokeDasharray: '283 283',
    strokeDashoffset: '283',
    transition: 'stroke-dashoffset linear',
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))',
  },
  contentWrapper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: 100,
    height: 100,
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Roboto Mono, monospace',
    color: '#ffffff',
    fontWeight: 900,
    fontSize: 24,
    lineHeight: 1,
    animation: `${numberGlow} 2s ease-in-out infinite`,
  },
  percentage: {
    fontSize: 14,
    opacity: 0.9,
    marginLeft: 2,
  },
  label: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 16,
    maxWidth: 250,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textShadow: '0 0 10px rgba(0, 255, 255, 0.6)',
    letterSpacing: '0.5px',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    padding: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  // Add decorative elements
  decorativeElements: {
    position: 'absolute',
    width: 160,
    height: 160,
    zIndex: 1,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 10,
      left: 10,
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'rgba(0, 255, 255, 0.8)',
      boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
      animation: `${rotate} 3s linear infinite`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 10,
      right: 10,
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: 'rgba(0, 255, 255, 0.6)',
      boxShadow: '0 0 8px rgba(0, 255, 255, 0.6)',
      animation: `${rotate} 4s linear infinite reverse`,
    },
  },
  // Responsive design
  '@media (max-width: 768px)': {
    progressWrapper: {
      width: 120,
      height: 120,
    },
    outerRing: {
      width: 120,
      height: 120,
    },
    progressSvg: {
      width: 100,
      height: 100,
    },
    decorativeElements: {
      width: 140,
      height: 140,
    },
    value: {
      fontSize: 20,
    },
    label: {
      fontSize: 14,
      maxWidth: 200,
    },
  },
}));

const CircleProgressbarModern: React.FC = () => {
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
        if (newValue >= 100) {
          clearInterval(updateProgress);
          setTimeout(() => setVisible(false), 500);
        }
        return newValue;
      });
    }, onePercent);
  });

  // Calculate stroke-dashoffset for progress bar
  const circumference = 283;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Stack spacing={0} className={classes.container}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Stack spacing={0} align="center" className={classes.wrapper}>
          <Box className={classes.progressWrapper}>
            <Box className={classes.outerRing} />
            <Box className={classes.decorativeElements} />
            <svg className={classes.progressSvg}>
              <defs>
                <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0, 255, 255, 1)" />
                  <stop offset="50%" stopColor="rgba(0, 200, 255, 1)" />
                  <stop offset="100%" stopColor="rgba(0, 150, 255, 1)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
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
                style={{
                  strokeDashoffset: strokeDashoffset,
                  transitionDuration: `${progressDuration}ms`,
                }}
                filter="url(#glow)"
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

export default CircleProgressbarModern;