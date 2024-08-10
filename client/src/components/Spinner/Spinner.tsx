import { styled } from "styled-components";
import SpinnerAnim from "../assets/icons/180-ring.svg";
import CheckmarkIcon from "../assets/icons/ic_checkmark_cricle.svg";

const Container = styled.div<{ $visible?: boolean }>`
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  visible: boolean;
  success?: boolean;
}

const Spinner = ({ visible, success }: Props) => {
  const image = success ? <CheckmarkIcon /> : <SpinnerAnim />;

  return (
    <Container $visible={visible} data-testid="container">
      { image }
    </Container>
  );
};

export default Spinner;
