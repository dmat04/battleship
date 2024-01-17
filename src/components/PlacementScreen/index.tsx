import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";

const PlacementScreen = () => {
  const dispatch = useAppDispatch();
  const roomID = useAppSelector((state) => state.gameRoom.roomID);
  const gameSettings = useAppSelector((state) => state.gameRoom.gameSettings);

  if (!roomID) return <Navigate to="start" replace />;

  if (!gameSettings) return null;

  return (

  );
};

export default PlacementScreen;
