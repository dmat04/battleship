/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { GameRoomStatus } from './gameRoom/resolvers/GameRoomStatus';
import    { GameSettings } from './gameRoom/resolvers/GameSettings';
import    { LoginResult } from './user/resolvers/LoginResult';
import    { createRoom as Mutation_createRoom } from './gameRoom/resolvers/Mutation/createRoom';
import    { guestLogin as Mutation_guestLogin } from './user/resolvers/Mutation/guestLogin';
import    { joinRoom as Mutation_joinRoom } from './gameRoom/resolvers/Mutation/joinRoom';
import    { placeShips as Mutation_placeShips } from './gameRoom/resolvers/Mutation/placeShips';
import    { registerUser as Mutation_registerUser } from './user/resolvers/Mutation/registerUser';
import    { registeredLogin as Mutation_registeredLogin } from './user/resolvers/Mutation/registeredLogin';
import    { PlacedShip } from './gameRoom/resolvers/PlacedShip';
import    { checkUsername as Query_checkUsername } from './user/resolvers/Query/checkUsername';
import    { gameSettings as Query_gameSettings } from './gameRoom/resolvers/Query/gameSettings';
import    { ping as Query_ping } from './base/resolvers/Query/ping';
import    { RoomCreatedResult } from './gameRoom/resolvers/RoomCreatedResult';
import    { RoomJoinedResult } from './gameRoom/resolvers/RoomJoinedResult';
import    { Ship } from './gameRoom/resolvers/Ship';
import    { ShipsPlacedResult } from './gameRoom/resolvers/ShipsPlacedResult';
import    { UsernameQueryResult } from './user/resolvers/UsernameQueryResult';
    export const resolvers: Resolvers = {
      Query: { checkUsername: Query_checkUsername,gameSettings: Query_gameSettings,ping: Query_ping },
      Mutation: { createRoom: Mutation_createRoom,guestLogin: Mutation_guestLogin,joinRoom: Mutation_joinRoom,placeShips: Mutation_placeShips,registerUser: Mutation_registerUser,registeredLogin: Mutation_registeredLogin },
      
      GameRoomStatus: GameRoomStatus,
GameSettings: GameSettings,
LoginResult: LoginResult,
PlacedShip: PlacedShip,
RoomCreatedResult: RoomCreatedResult,
RoomJoinedResult: RoomJoinedResult,
Ship: Ship,
ShipsPlacedResult: ShipsPlacedResult,
UsernameQueryResult: UsernameQueryResult
    }