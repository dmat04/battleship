/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
import type { Resolvers } from "@battleship/common/types/__generated__/types.generated.js";
import { checkUsername as Query_checkUsername } from "./../resolvers/Query/checkUsername.js";
import { gameSettings as Query_gameSettings } from "./../resolvers/Query/gameSettings.js";
import { ping as Query_ping } from "./../resolvers/Query/ping.js";
import { createRoom as Mutation_createRoom } from "./../resolvers/Mutation/createRoom.js";
import { guestLogin as Mutation_guestLogin } from "./../resolvers/Mutation/guestLogin.js";
import { joinRoom as Mutation_joinRoom } from "./../resolvers/Mutation/joinRoom.js";
import { placeShips as Mutation_placeShips } from "./../resolvers/Mutation/placeShips.js";
import { registerUser as Mutation_registerUser } from "./../resolvers/Mutation/registerUser.js";
import { registeredLogin as Mutation_registeredLogin } from "./../resolvers/Mutation/registeredLogin.js";
import { GameRoomStatus } from "./../resolvers/GameRoomStatus.js";
import { GameSettings } from "./../resolvers/GameSettings.js";
import { LoginResult } from "./../resolvers/LoginResult.js";
import { PlacedShip } from "./../resolvers/PlacedShip.js";
import { RoomCreatedResult } from "./../resolvers/RoomCreatedResult.js";
import { RoomJoinedResult } from "./../resolvers/RoomJoinedResult.js";
import { Ship } from "./../resolvers/Ship.js";
import { ShipsPlacedResult } from "./../resolvers/ShipsPlacedResult.js";
import { UsernameQueryResult } from "./../resolvers/UsernameQueryResult.js";
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
