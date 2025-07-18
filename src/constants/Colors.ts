export const Colors = {
  background: '#000000',
  backgroundSoft: '#181818',
  backgroundUltraSoft: '#252525',
  foregroundSoft: '#ffffff15',
  spotifyGreen: '#1DB954',
  secondaryGreen: '#00B290',
  secondaryGreenDark: '#004135',
  appleRed: '#fa233b',
  white: '#FFFFFF',
  lessMutedWhite: '#FFFFFFCC',
  mutedWhite: '#FFFFFF99',
  gold: '#D4AF37',
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