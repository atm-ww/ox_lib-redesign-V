import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { 
    sm: '0 0 10px rgba(0, 255, 255, 0.3)',
    md: '0 0 20px rgba(0, 255, 255, 0.4)',
    lg: '0 0 30px rgba(0, 255, 255, 0.5)'
  },
  colors: {
    cyan: [
      '#e6ffff',
      '#ccffff',
      '#99ffff',
      '#66ffff',
      '#33ffff',
      '#00ffff', // 螢光藍
      '#00cccc',
      '#009999',
      '#006666',
      '#003333'
    ]
  },
  components: {
    Button: {
      styles: {
        root: {
          border: '1px solid #00ffff',
          backgroundColor: 'transparent',
          color: '#ffffff',
          textShadow: '0 0 8px #ffffff',
          fontWeight: 600,
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
          '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.6)',
          }
        },
      },
    },
  },
};
