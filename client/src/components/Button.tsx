import styled from "styled-components";
import { CSSProperties } from "react";
import { Theme } from "./assets/themes/themeDefault";
import Spinner from "./Spinner";

export type ButtonVariant = "primary" | "warning" | "danger";

const ButtonElement = styled.button<{ $variant: ButtonVariant; theme: Theme }>`
  --colorBg: ${(props) => {
    switch (props.$variant) {
      case "warning":
        return props.theme.colors.containerWarning;
      case "danger":
        return props.theme.colors.containerDanger;
      case "primary":
      default:
        return props.theme.colors.containerSecondary;
    }
  }};
  --colorContent: ${(props) => {
    switch (props.$variant) {
      case "warning":
        return props.theme.colors.onContainerWarning;
      case "danger":
        return props.theme.colors.onContainerDanger;
      case "primary":
      default:
        return props.theme.colors.onContainerSecondary;
    }
  }};

  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--colorBg);
  color: var(--colorContent);
  border: ${(props) => props.theme.borderStyle};
  transition: ${(props) =>
    `all ${props.theme.durationTransitionDefault}ms ease-out`};
  padding: ${(props) => props.theme.paddingMin};

  &:hover {
    filter: invert(10%) saturate(300%);
  }

  &:disabled {
    filter: opacity(60%);
  }
`;

const SpinnerContainer = styled.div`
  position: absolute;
  width: min-content;
`;

const ChildrenContainer = styled.div<{ $visible: boolean }>`
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
`;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  style?: CSSProperties;
}

const Button = ({
  children,
  variant = "primary",
  loading = false,
  style = {},
  ...rest
}: React.PropsWithChildren<Props>) => (
  <ButtonElement $variant={variant} style={style} {...rest}>
    <ChildrenContainer $visible={!loading}>{children}</ChildrenContainer>
    <SpinnerContainer>
      <Spinner visible={loading} />
    </SpinnerContainer>
  </ButtonElement>
);

export default Button;
