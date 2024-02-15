import styled from 'styled-components';
import SpinnerAnim from './assets/icons/180-ring.svg';
import CheckmarkIcon from './assets/icons/ic_checkmark_cricle.svg';

const Spinner = styled.div<{ $visible: boolean, $success?: boolean }>`
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  background: ${(props) => (props.$success ? `url(${CheckmarkIcon})` : `url(${SpinnerAnim})`)};
  background-position: center;
  background-repeat: no-repeat;
  width: 2rem;
  aspect-ratio: 1;
`;

Spinner.defaultProps = {
  $visible: true,
  $success: false,
};

export default Spinner;
