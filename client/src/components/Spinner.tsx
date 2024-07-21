import styled from "styled-components";
import SpinnerAnim from "./assets/icons/180-ring.svg";
import CheckmarkIcon from "./assets/icons/ic_checkmark_cricle.svg";

const Container = styled.div<{ $visible?: boolean }>`
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  visible?: boolean;
  success?: boolean;
}

const defaultProps: Props = {
  visible: true,
  success: false,
};

const Spinner = ({ visible, success }: Props) => {
  const Image = success ? CheckmarkIcon : SpinnerAnim;

  return (
    <Container $visible={visible}>
      <Image />
    </Container>
  );
};

// Spinner.defaultProps = defaultProps;

export default Spinner;
