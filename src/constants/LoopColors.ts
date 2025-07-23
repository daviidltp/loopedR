export const LoopColors = {
  white: {
    backgroundColor: '#FFFFFF22',
    borderColor: '#FFFFFF77',
    titleColor: '#FFFFFF',
  },
  red: {
    backgroundColor: '#FF767622',
    borderColor: '#FF767677',
    titleColor: '#EEB9B9',
  },
  purple: {
    backgroundColor: '#A876FF22',
    borderColor: '#A876FF77',
    titleColor: '#CBB9EE',
  },
  blue: {
    backgroundColor: '#76D1FF22',
    borderColor: '#76D1FF77',
    titleColor: '#B9D6EE',
  },
  yellow: {
    backgroundColor: '#FFEF7622',
    borderColor: '#FFEF7677',
    titleColor: '#FFEF76',
  },
} as const;

export type LoopColorName = keyof typeof LoopColors; 