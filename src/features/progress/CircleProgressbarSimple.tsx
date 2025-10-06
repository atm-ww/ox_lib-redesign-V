import React from 'react';
import { createStyles, Stack, Text, Box } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

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
    gap: 12,
  },
  progressWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSvg: {
    width: 100,
    height: 100,
    transform: 'rotate(-90deg)',
  },
  progressTrack: {
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.1)',
    strokeWidth: 4,
  },
  progressBar: {
    fill: 'none',
    stroke: '#00ffff',
    strokeWidth: 4,
    strokeLinecap: 'round',
    strokeDasharray: '251.2', // 2 * π * 40 = 251.2
    strokeDashoffset: '251.2',
    transition: `stroke-dashoffset ${params.duration}ms linear`,
    filter: 'drop-shadow(0 0 6px rgba(0, 255, 255, 0.6))',
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
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1,
    textShadow: '0 0 8px rgba(0, 255, 255, 0.8)',
  },
  percentage: {
    fontSize: 12,
    opacity: 0.9,
    marginLeft: 1,
  },
  label: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 500,
    fontSize: 14,
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textShadow: '0 0 6px rgba(0, 255, 255, 0.6)',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    padding: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  // Responsive design
  '@media (max-width: 768px)': {
    progressWrapper: {
      width: 80,
      height: 80,
    },
    progressSvg: {
      width: 80,
      height: 80,
    },
    value: {
      fontSize: 16,
    },
    label: {
      fontSize: 12,
      maxWidth: 150,
    },
  },
}));

const CircleProgressbarSimple: React.FC = () => {
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
          setTimeout(() => setVisible(false), 300);
        }
        return newValue;
      });
    }, onePercent);
  });

  // Calculate stroke-dashoffset for progress bar
  const circumference = 251.2; // 2 * π * 40
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Stack spacing={0} className={classes.container}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Stack spacing={0} align="center" className={classes.wrapper}>
          <Box className={classes.progressWrapper}>
            <svg className={classes.progressSvg}>
              <circle
                className={classes.progressTrack}
                cx="50"
                cy="50"
                r="40"
              />
              <circle
                className={classes.progressBar}
                cx="50"
                cy="50"
                r="40"
                style={{
                  strokeDashoffset: strokeDashoffset,
                }}
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

export default CircleProgressbarSimple;