export const Colors = {
  background: '#000000',
  backgroundSoft: '#111111',
  backgroundUltraSoft: '#252525',
  spotifyGreen: '#1DB954',
  secondaryGreen: '#00B290',
  appleRed: '#fa233b',
  white: '#FFFFFF',
  gray: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

export type ColorType = typeof Colors; 