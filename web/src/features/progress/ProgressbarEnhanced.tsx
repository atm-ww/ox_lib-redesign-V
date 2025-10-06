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

// Glow pulse effect
const glowPulse = keyframes({
  '0%, 100%': {
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.6), inset 0 0 15px rgba(0, 255, 255, 0.1)',
  },
  '50%': {
    boxShadow: '0 0 25px rgba(0, 255, 255, 0.8), inset 0 0 25px rgba(0, 255, 255, 0.2)',
  },
});

// Shimmer effect
const shimmer = keyframes({
  '0%': {
    transform: 'translateX(-100%)',
  },
  '100%': {
    transform: 'translateX(100%)',
  },
});

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  container: {
    width: 380,
    height: 20, // Moderate height - not too thick or too thin
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(0, 255, 255, 0.4)',
    boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 9,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: `
      linear-gradient(90deg, 
        rgba(0, 255, 255, 0.8) 0%,
        rgba(0, 255, 255, 1) 100%
      )
    `,
    borderRadius: 9,
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
    overflow: 'hidden',
    // Keep shimmer effect
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `
        linear-gradient(90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%
        )
      `,
      animation: `${shimmer} 2.5s ease-in-out infinite`,
    },
  },
  labelWrapper: {
    position: 'absolute',
    top: -25, // Place text above progress bar
    left: 0,
    width: '100%',
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  label: {
    maxWidth: 360,
    padding: '0 8px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 14, // Slightly smaller font
    color: '#ffffff',
    textShadow: `
      0 0 8px rgba(0, 0, 0, 0.8),
      0 0 12px rgba(0, 255, 255, 0.6),
      1px 1px 2px rgba(0, 0, 0, 0.9)
    `,
    fontWeight: 600,
    letterSpacing: '0.3px',
    textAlign: 'center',
  },
  // Responsive design
  '@media (max-width: 768px)': {
    container: {
      width: 320,
      height: 45,
    },
    label: {
      fontSize: 14,
      maxWidth: 300,
    },
  },
}));

const ProgressbarEnhanced: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
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
          <Box className={classes.labelWrapper}>
            <Text className={classes.label}>{label}</Text>
          </Box>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default ProgressbarEnhanced;