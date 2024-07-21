/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from "@battleship/common/types/__generated__/types.generated";
import { checkUsername as Query_checkUsername } from "./../resolvers/Query/checkUsername";
import { gameSettings as Query_gameSettings } from "./../resolvers/Query/gameSettings";
import { ping as Query_ping } from "./../resolvers/Query/ping";
import { createRoom as Mutation_createRoom } from "./../resolvers/Mutation/createRoom";
import { guestLogin as Mutation_guestLogin } from "./../resolvers/Mutation/guestLogin";
import { joinRoom as Mutation_joinRoom } from "./../resolvers/Mutation/joinRoom";
import { placeShips as Mutation_placeShips } from "./../resolvers/Mutation/placeShips";
import { registerUser as Mutation_registerUser } from "./../resolvers/Mutation/registerUser";
import { registeredLogin as Mutation_registeredLogin } from "./../resolvers/Mutation/registeredLogin";
import { GameRoomStatus } from "./../resolvers/GameRoomStatus";
import { GameSettings } from "./../resolvers/GameSettings";
import { LoginResult } from "./../resolvers/LoginResult";
import { PlacedShip } from "./../resolvers/PlacedShip";
import { RoomCreatedResult } from "./../resolvers/RoomCreatedResult";
import { RoomJoinedResult } from "./../resolvers/RoomJoinedResult";
import { Ship } from "./../resolvers/Ship";
import { ShipsPlacedResult } from "./../resolvers/ShipsPlacedResult";
import { UsernameQueryResult } from "./../resolvers/UsernameQueryResult";
export const resolvers: Resolvers = {
  Query: {
    checkUsername: Query_checkUsername,
    gameSettings: Query_gameSettings,
    ping: Query_ping,
  },
  Mutation: {
    createRoom: Mutation_createRoom,
    guestLogin: Mutation_guestLogin,
    joinRoom: Mutation_joinRoom,
    placeShips: Mutation_placeShips,
    registerUser: Mutation_registerUser,
    registeredLogin: Mutation_registeredLogin,
  },

  GameRoomStatus: GameRoomStatus,
  GameSettings: GameSettings,
  LoginResult: LoginResult,
  PlacedShip: PlacedShip,
  RoomCreatedResult: RoomCreatedResult,
  RoomJoinedResult: RoomJoinedResult,
  Ship: Ship,
  ShipsPlacedResult: ShipsPlacedResult,
  UsernameQueryResult: UsernameQueryResult,
};
