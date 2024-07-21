import styled from "styled-components";
import { useState } from "react";
import TextInput from "../TextInput";
import { Theme } from "../assets/themes/themeDefault";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { joinGameRoom } from "../../store/gameRoomSlice/thunks";
import Button from "../Button";

const Container = styled.form<{ theme: Theme }>`
  display: grid;
  grid-template-rows: 0.75fr 0.75fr 1fr;
  grid-template-areas:
    "code"
    "label"
    "button";
  grid-row-gap: ${(props) => props.theme.paddingMin};
  grid-column-gap: ${(props) => props.theme.paddingMin};
  padding: ${(props) => props.theme.paddingMin} 0 0 0;
  width: 100%;
`;

const Label = styled.p`
  grid-area: label;
  text-align: center;
`;

interface Props {
  disabled: boolean;
}

const JoinGameForm = ({ disabled }: Props) => {
  const dispatch = useAppDispatch();
  const loadingJoinRoom = useAppSelector(
    (state) => state.gameRoom.requestStatus.loadingJoinRoom,
  );

  const [code, setCode] = useState<string>("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    if (loadingJoinRoom) return;

    if (code.length > 0) {
      void dispatch(joinGameRoom(code));
    }
  };

  return (
    <Container onSubmit={handleSubmit}>
      <TextInput
        type="text"
        inputMode="numeric"
        placeholder="Room code"
        style={{ gridArea: "code" }}
        value={code}
        onChange={(ev) => setCode(ev.target.value)}
        disabled={disabled}
      />
      <Label>Join using an invite code.</Label>
      <Button
        type="submit"
        variant="primary"
        style={{ gridArea: "button" }}
        disabled={disabled || code.length === 0}
        loading={loadingJoinRoom}
      >
        <div>Join</div>
      </Button>
    </Container>
  );
};

export default JoinGameForm;
