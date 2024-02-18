/* eslint-disable object-curly-newline */
export type Theme = typeof themeDefault;
export type GameScreenTheme = typeof gameScreenThemeDefault;

const gameScreenThemeDefault = {
  missedCellAnimStart: { opacity: 1, scale: 0.66, background: '#ffffff', zIndex: 10 },
  missedCellAnimSteps: { opacity: 0.9, scale: 1, background: '#01579b', zIndex: 1 },

  hitCellAnimStart: { opacity: 1, scale: 0.66, background: '#ffffff', zIndex: 10 },
  hitCellAnimSteps: [
    { opacity: 1, scale: 1.33, background: '#ffd600', zIndex: 10 },
    { opacity: 0.9, scale: 1, background: '#ff6d00', zIndex: 1 },
  ],

  sunkShipAnimStart: { opacity: 1, scale: 1, background: '#ffffff', zIndex: 10 },
  sunkShipAnimSteps: [
    { opacity: 1, scale: 1.1, background: '#ffd600', zIndex: 10 },
    { opacity: 0.9, scale: 1, background: '#a62d24', zIndex: 1 },
  ],
};

const themeDefault = {
  paddingMin: '1rem',
  paddingSm: '2rem',
  paddingLg: '5rem',
  colorSecondary: '#e5e5f7',
  colorPrimary: '#444cf7',
  durationTransitionDefault: 250,
  dimensionBorderSm: '1px',
  dimensionBorder: '2px',
  dimensionIconSize: '2rem',
  gameScreenTheme: gameScreenThemeDefault,
  color100: 'white',
  color200: 'hsl(200, 100%, 90%)',
  color300: 'hsl(200, 100%, 50%)',
  color400: 'hsl(207, 73%, 66%)',
  color500: 'hsl(209, 81%, 50%)',
  color600: 'hsl(231, 75%, 63%)',
  color700: 'hsl(250, 73%, 65%)',
  colorLogo: '#975218',
};

export default themeDefault;
