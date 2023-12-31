export interface Theme {
  paddingMin: string;
  paddingSm: string;
  colorBg: string;
  colorBorder: string;
  durationTransitionDefault: string;
  dimensionBorderSm: string;
  dimensionBorder: string;
  dimensionIconSize: string;
}

const themeDefault: Theme = {
  paddingMin: '1rem',
  paddingSm: '2rem',
  colorBg: '#e5e5f7',
  colorBorder: '#444cf7',
  durationTransitionDefault: '250ms',
  dimensionBorderSm: '1px',
  dimensionBorder: '2px',
  dimensionIconSize: '2rem',
};

export default themeDefault;
