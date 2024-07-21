import styled from "styled-components";
import { Theme } from "../../assets/themes/themeDefault";
import IconInfo from "../../assets/icons/ic_info.svg";
import useGameHint from "../../../hooks/useGameHint";
import Button from "../../Button";

const HintContainer = styled.div<{ theme: Theme }>`
  --tooltip-arrow-size: 12px;
  --gap: ${(props) => props.theme.paddingMin};

  position: absolute;
  display: grid;
  grid-template-columns: auto 1fr auto;
  justify-content: space-between;
  align-items: center;
  padding: var(--gap);
  margin-inline: var(--gap);
  gap: var(--gap);
  z-index: 9999;
  transform: translate3d(0, -80%, 0);
  filter: drop-shadow(${(props) => props.theme.boxShadow});
  border: ${(props) => props.theme.borderStyle};
  color: ${(props) => props.theme.colors.onContainerWarning};
  background-color: ${(props) => props.theme.colors.containerWarning};

  &:before {
    content: "";
    position: absolute;
    pointer-events: none;
    border: solid transparent;
    border-width: var(--tooltip-arrow-size);
    border-top-color: inherit;
    border-right-color: transparent;
    top: 100%;
    left: calc(50% - var(--gap));

    @media (min-width: 100em) {
      border-top-color: transparent;
      border-right-color: inherit;
      top: calc(50% - var(--gap));
      left: calc(-2 * var(--tooltip-arrow-size));
    }
  }

  @media (min-width: 100em) {
    transform: translate3d(110%, 100%, 0);
  }
`;

const HintBox = () => {
  const { hint, nextHint } = useGameHint();

  if (hint === null) return null;

  return (
    <HintContainer>
      <IconInfo />
      <p>{hint}</p>
      <Button onClick={nextHint}>Got it</Button>
    </HintContainer>
  );
};

export default HintBox;
