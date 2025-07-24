export const LoopColors = {
  white: {
    basicColor: '#FFFFFF',
    backgroundColor: '#FFFFFF22',
    borderColor: '#FFFFFF77',
    titleColor: '#FFFFFF',
  },
  red: {
    basicColor: '#FF7676',
    backgroundColor: '#FF767622',
    borderColor: '#FF767677',
    titleColor: '#EEB9B9',
  },
  purple: {
    basicColor: '#A876FF',
    backgroundColor: '#A876FF22',
    borderColor: '#A876FF77',
    titleColor: '#CBB9EE',
  },
  blue: {
    basicColor: '#76D1FF',
    backgroundColor: '#76D1FF22',
    borderColor: '#76D1FF77',
    titleColor: '#B9D6EE',
  },
  yellow: {
    basicColor: '#FFEF76',
    backgroundColor: '#FFEF7622',
    borderColor: '#FFEF7677',
    titleColor: '#FFEF76',
  },
  green: {
    basicColor: '#00B290',
    backgroundColor: '#00B29022',
    borderColor: '#00B29077',
    titleColor: '#00B290',
  },
} as const;

export type LoopColorName = keyof typeof LoopColors; 