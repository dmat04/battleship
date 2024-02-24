/* eslint-disable object-curly-newline */
export type Theme = typeof themeDefault;
export type GameScreenTheme = typeof gameScreenThemeDefault;

const gameScreenThemeDefault = {
  missedCellAnimStart: { opacity: 1, scale: 0.66, background: 'transparent', zIndex: 10 },
  missedCellAnimSteps: { opacity: 0.9, scale: 1, background: '#01579b', zIndex: 1 },

  hitCellAnimStart: { opacity: 1, scale: 0.66, background: 'transparent', zIndex: 10 },
  hitCellAnimSteps: [
    { opacity: 1, scale: 1.33, background: '#ffd600', zIndex: 10 },
    { opacity: 0.9, scale: 1, background: '#ff6d00', zIndex: 1 },
  ],

  sunkShipAnimStart: { opacity: 1, scale: 0.5, background: 'transparent', fill: 'transparent', stroke: 'transparent', zIndex: 20 },
  sunkShipAnimSteps: [
    { opacity: 1, scale: 1.2, fill: '#ffd600', stroke: '#ffd600', zIndex: 20 },
    { opacity: 1, scale: 1, fill: '#a62d24', stroke: '#a62d24', zIndex: 20 },
    { opacity: 0.9, zIndex: 1 },
  ],
};

const themeDefault = {
  paddingMin: '1rem',
  paddingSm: '2rem',
  paddingLg: '5rem',
  durationTransitionDefault: 250,
  dimensionBorderSm: '1px',
  dimensionBorder: '2px',
  dimensionIconSize: '2rem',
  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 20px 10px',
  colors: {
    hero: 'hsl(200, 100%, 50%)',
    heroComplementary: 'hsl(27, 73%, 34%)',
    surfacePrimary: 'hsl(200, 100%, 90%)',
    surfaceSecondary: 'hsl(201, 53%, 74%)',
    surfaceTertiary: 'hsl(0, 100%, 100%)',
    containerPrimary: 'hsl(0, 100%, 100%)',
    containerSecondary: 'hsl(229, 100%, 90%)',
    containerTertiary: 'hsl(250, 73%, 65%)',
    containerSuccess: 'hsl(229, 100%, 90%)',
    containerWarning: 'hsl(50, 100%, 90%)',
    containerDanger: 'hsl(0, 85%, 85%)',
    surfacePrimaryComp: 'hsl(27, 73%, 34%)',
    onSurfacePrimary: '#000000',
    onSurfaceSecondary: '#212121',
    onSurfaceTertiary: '#424242',
    onContainerPrimary: '#424242',
    onContainerSecondary: '#212121',
    onContainerTertiary: '#FAFAFA',
    onContainerSuccess: '#212121',
    onContainerWarning: '#424242',
    onContainerDanger: '#212121',
    shipColor: '#90A4AE',
    shipBorder: '#37474F',
    shipBorderSuccess: '#00796B',
    shipBorderError: '#ff5500',
  },
  gameScreen: gameScreenThemeDefault,
  gameGridLineThickness: '0.1em',
};

export default themeDefault;
