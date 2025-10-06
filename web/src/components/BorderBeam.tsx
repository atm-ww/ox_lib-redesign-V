import React from "react";
import { motion } from "framer-motion";
import { createStyles, keyframes } from "@mantine/core";

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number;
  /**
   * The duration of the border beam.
   */
  duration?: number;
  /**
   * The delay of the border beam.
   */
  delay?: number;
  /**
   * The color of the border beam from.
   */
  colorFrom?: string;
  /**
   * The color of the border beam to.
   */
  colorTo?: string;
  /**
   * The motion transition of the border beam.
   */
  transition?: any;
  /**
   * The class name of the border beam.
   */
  className?: string;
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties;
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean;
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number;
  /**
   * The thickness of the border.
   */
  borderThickness?: number;
  /**
   * The opacity of the beam.
   */
  opacity?: number;
  /**
   * The intensity of the glow effect.
   */
  glowIntensity?: number;
  /**
   * Border radius of the beam in pixels.
   */
  beamBorderRadius?: number;
  /**
   * Whether to pause animation on hover.
   */
  pauseOnHover?: boolean;
  /**
   * Animation speed multiplier (higher is faster).
   */
  speedMultiplier?: number;
}

// Color cycle animation
const colorCycle = keyframes({
  '0%': {
    background: 'linear-gradient(to left, #0066ff, #0099ff, transparent)', // Blue
    boxShadow: '0 0 20px 8px #0066ff',
  },
  '50%': {
    background: 'linear-gradient(to left, #ff0066, #ff3399, transparent)', // Red
    boxShadow: '0 0 20px 8px #ff0066',
  },
  '100%': {
    background: 'linear-gradient(to left, #0066ff, #0099ff, transparent)', // Back to blue
    boxShadow: '0 0 20px 8px #0066ff',
  },
});

const useStyles = createStyles(() => ({
  container: {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    border: 'transparent',
    maskClip: 'padding-box, border-box',
    maskComposite: 'intersect',
    maskImage: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
  },
  beam: {
    position: 'absolute',
    aspectRatio: '1',
  },
  beamWithColorCycle: {
    position: 'absolute',
    aspectRatio: '1',
    animation: `${colorCycle} 3s ease-in-out infinite`, // 3 second cycle
  },
}));

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#0066ff",
  colorTo = "#ff0066",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderThickness = 1,
  opacity = 1,
  glowIntensity = 0,
  beamBorderRadius,
  pauseOnHover = false,
  speedMultiplier = 1,
}) => {
  const { classes } = useStyles();
  
  // Calculate actual duration based on speed multiplier
  const actualDuration = speedMultiplier ? duration / speedMultiplier : duration;

  return (
    <div 
      className={classes.container}
      style={{
        borderWidth: `${borderThickness}px`,
      }}
    >
      <motion.div
        className={`${classes.beamWithColorCycle} ${className || ''}`}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${beamBorderRadius ?? size}px)`,
          opacity: opacity,
          borderRadius: beamBorderRadius ? `${beamBorderRadius}px` : undefined,
          ...style,
        } as any}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: actualDuration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};