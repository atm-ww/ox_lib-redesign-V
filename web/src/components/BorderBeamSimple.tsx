import React from "react";
import { createStyles, keyframes } from "@mantine/core";

interface BorderBeamSimpleProps {
  size?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Blue-red cycle animation
const colorCycle = keyframes({
  '0%': {
    borderColor: '#0066ff',
    boxShadow: '0 0 20px rgba(0, 102, 255, 0.8), inset 0 0 20px rgba(0, 102, 255, 0.2)',
  },
  '50%': {
    borderColor: '#ff0066',
    boxShadow: '0 0 20px rgba(255, 0, 102, 0.8), inset 0 0 20px rgba(255, 0, 102, 0.2)',
  },
  '100%': {
    borderColor: '#0066ff',
    boxShadow: '0 0 20px rgba(0, 102, 255, 0.8), inset 0 0 20px rgba(0, 102, 255, 0.2)',
  },
});

// Rotating beam animation
const rotateBeam = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const useStyles = createStyles(() => ({
  container: {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
  animatedBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    border: '1px solid transparent',
    animation: `${colorCycle} 3s ease-in-out infinite`,
    background: 'transparent', // Ensure background is transparent
  },
}));

export const BorderBeamSimple: React.FC<BorderBeamSimpleProps> = ({
  className,
  style,
}) => {
  const { classes } = useStyles();

  return (
    <div className={`${classes.container} ${className || ''}`} style={style}>
      <div className={classes.animatedBorder} />
    </div>
  );
};