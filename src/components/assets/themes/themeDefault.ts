export type ThemeType = 'light' | 'dark';

/* eslint-disable object-curly-newline */
export type Theme = typeof themeDefault;

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
    shipFill: 'rgb(143 163 174 / 80%)',
    shipStroke: 'rgb(54 70 78 / 80%)',
    shipBorderSuccess: 'rgb(110 204 51 / 100%)',
    shipBorderError: 'rgb(223 32 32 / 100%)',
    hitCell: 'hsl(27 73% 50% / 70%)',
    hitCellHighlight: 'hsl(50 100% 50% / 80%)',
    missedCell: 'hsl(211 92% 30% / 70%)',
    sunkShipHighlight: 'rgb(255 213 0 / 80%)',
    sunkShipFill: 'rgb(191 64 64 / 60%)',
    sunkShipStroke: 'rgb(54 70 78 / 80%)',
    scoreGreen: '#388E3C',
    scoreRed: '#E64A19',
  },
  gameGridLineThickness: '0.1em',
};

export default themeDefault;
