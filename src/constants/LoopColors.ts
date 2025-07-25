export const LoopColors = {
  white: {
    basicColor: '#FFFFFF',
    backgroundColor: '#FFFFFF44',
    borderColor: '#FFFFFF77',
    titleColor: '#FFFFFF',
  },
  red: {
    basicColor: '#FF7676',
    backgroundColor: '#FF767644',
    borderColor: '#FF767677',
    titleColor: '#fff',
  },
  purple: {
    basicColor: '#A876FF',
    backgroundColor: '#A876FF44',
    borderColor: '#A876FF77',
    titleColor: '#fff',
  },
  blue: {
    basicColor: '#76D1FF',
    backgroundColor: '#76D1FF44',
    borderColor: '#76D1FF77',
    titleColor: '#fff',
  },
  yellow: {
    basicColor: '#FFEF76',
    backgroundColor: '#FFEF7644',
    borderColor: '#FFEF7677',
    titleColor: '#fff',
  },
  green: {
    basicColor: '#00B290',
    backgroundColor: '#00B29044',
    borderColor: '#00B29077',
    titleColor: '#fff',
  },
} as const;

export type LoopColorName = keyof typeof LoopColors; 