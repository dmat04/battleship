import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { ShipOrientation } from '../../../__generated__/graphql';
import { Theme } from '../../assets/themes/themeDefault';

const getPath = (shipSize: number, vertical: boolean) => {
  switch (shipSize) {
    case 2:
      return vertical
        ? 'M 0 15 V 12 C 0 5 4 2 6 1 Q 10 -1 14 1 C 16 2 20 5 20 12 L 20 30 C 20 40 20 40 15 40 L 5 40 C 0 40 0 40 0 30 Z'
        : 'M 25 0 H 28 C 35 -0 38 4 39 6 Q 41 10 39 14 C 38 16 35 20 28 20 L 10 20 C 0 20 0 20 0 15 L 0 5 C 0 0 0 0 10 0 Z';
    case 3:
      return vertical
        ? 'M 0 15 V 12 C 0 5 4 2 6 1 Q 10 -1 14 1 C 16 2 20 5 20 12 L 20 50 C 20 60 20 60 15 60 L 5 60 C 0 60 0 60 0 50 Z'
        : 'M 45 0 H 48 C 55 0 58 4 59 6 Q 61 10 59 14 C 58 16 55 20 48 20 L 10 20 C 0 20 0 20 0 15 L 0 5 C 0 0 0 0 10 0 Z';
    case 4:
      return vertical
        ? 'M 0 20 V 18 C 0 15 0 15 5 6 Q 10 -6 15 6 C 20 15 20 15 20 18 L 20 20 L 20 70 C 20 80 20 80 15 80 L 5 80 C 0 80 0 80 0 70 Z'
        : 'M 60 0 H 62 C 65 0 65 0 74 5 Q 86 10 74 15 C 65 20 65 20 62 20 L 60 20 L 10 20 C 0 20 0 20 0 15 L 0 5 C 0 0 0 0 10 0 Z';
    case 5:
      return vertical
        ? 'M 0 85 L 2 83 L 2 71 V 50 L 2 48 L 2 34 L 0 32 L 0 22 L 3 19 L 6 0 L 14 0 L 17 19 L 20 22 L 20 98 L 2 100 L 2 100 L 2 95 L 0 93 Z'
        : 'M 15 0 L 17 2 L 29 2 H 50 L 52 2 L 66 2 L 68 0 L 78 0 L 81 3 L 100 6 L 100 14 L 81 17 L 78 20 L 2 20 L 0 2 L 0 2 L 5 2 L 7 0 Z';
    default:
      return vertical
        ? 'M 0 15 V 7 C 0 5 4 2 6 1 Q 10 -1 14 1 C 16 2 20 5 20 7 L 20 15 C 20 20 20 20 15 20 H 5 C 0 20 0 20 0 15 Z'
        : 'M 5 0 H 13 C 15 0 18 4 19 6 Q 21 10 19 14 C 18 16 15 20 13 20 L 5 20 C 0 20 0 20 0 15 V 5 C 0 0 0 0 5 0 Z';
  }
};

const getViewBox = (shipSize: number, vertical: boolean) => {
  switch (shipSize) {
    case 2:
      return vertical
        ? '-1 -1 22 42'
        : '-1 -1 42 22';
    case 3:
      return vertical
        ? '-1 -1 22 62'
        : '-1 -1 62 22';
    case 4:
      return vertical
        ? '-1 -1 22 82'
        : '-1 -1 82 22';
    case 5:
      return vertical
        ? '-1 -1 22 102'
        : '-1 -1 102 22';
    default:
      return vertical
        ? '-1 -1 22 22'
        : '-1 -1 22 22';
  }
};

const SvgContainer = styled.svg`
  width: 90%;
  height: 90%;
`;

const SvgPath = styled(animated.path)<{ theme: Theme }>`
  fill: ${(props) => props.theme.colors.shipFill};
  stroke: ${(props) => props.theme.colors.shipStroke};
  stroke-width: 1.5;
`;

interface Props {
  shipSize: number;
  shipOrientation: ShipOrientation;
  pathStyle: any;
}

const ShipImage = ({ shipSize, shipOrientation, pathStyle }: Props) => {
  const vertical = shipOrientation === ShipOrientation.Vertical;
  const path = getPath(shipSize, vertical);
  const viewBox = getViewBox(shipSize, vertical);

  return (
    <SvgContainer viewBox={viewBox} preserveAspectRatio="none">
      <SvgPath d={path} style={pathStyle} />
    </SvgContainer>
  );
};

export default ShipImage;
