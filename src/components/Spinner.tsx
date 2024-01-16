import styled from 'styled-components';
import SpinnerAnim from './assets/icons/180-ring.svg';

const Spinner = styled.div<{ $visible: boolean }>`
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  background: url(${SpinnerAnim});
  background-position: center;
  background-repeat: no-repeat;
  width: 2rem;
  aspect-ratio: 1;
`;

export default Spinner;
