import type { ApolloContext } from "@battleship/common/utils/ApolloContext.js";
import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Coordinate = {
  __typename?: "Coordinate";
  x: Scalars["Int"]["output"];
  y: Scalars["Int"]["output"];
};

export type CoordinateInput = {
  x: Scalars["Int"]["input"];
  y: Scalars["Int"]["input"];
};

export type GameRoomStatus = {
  __typename?: "GameRoomStatus";
  currentPlayerID?: Maybe<Scalars["ID"]["output"]>;
  opponent?: Maybe<Player>;
  opponentShipsPlaced: Scalars["Boolean"]["output"];
  opponentSocketConnected: Scalars["Boolean"]["output"];
  player: Player;
  playerShipsPlaced: Scalars["Boolean"]["output"];
  playerSocketConnected: Scalars["Boolean"]["output"];
};

export type GameSettings = {
  __typename?: "GameSettings";
  availableShips: Array<Ship>;
  boardHeight: Scalars["Int"]["output"];
  boardWidth: Scalars["Int"]["output"];
  turnDuration: Scalars["Int"]["output"];
};

export type LoginResult = {
  __typename?: "LoginResult";
  accessToken: Scalars["String"]["output"];
  expiresAt: Scalars["String"]["output"];
  userID: Scalars["ID"]["output"];
  username: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createRoom: RoomCreatedResult;
  guestLogin?: Maybe<LoginResult>;
  joinRoom: RoomJoinedResult;
  placeShips?: Maybe<ShipsPlacedResult>;
  registerUser?: Maybe<LoginResult>;
  registeredLogin?: Maybe<LoginResult>;
};

export type MutationGuestLoginArgs = {
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationJoinRoomArgs = {
  inviteCode: Scalars["String"]["input"];
};

export type MutationPlaceShipsArgs = {
  roomID: Scalars["ID"]["input"];
  shipPlacements: Array<ShipPlacementInput>;
};

export type MutationRegisterUserArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationRegisteredLoginArgs = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type PlacedShip = {
  __typename?: "PlacedShip";
  orientation: ShipOrientation;
  position: Coordinate;
  ship: Ship;
};

export type Player = {
  __typename?: "Player";
  id: Scalars["ID"]["output"];
  username: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  checkGuestUsername: UsernameQueryResult;
  checkRegisteredUsername: UsernameQueryResult;
  gameSettings: GameSettings;
  ping: Scalars["String"]["output"];
};

export type QueryCheckGuestUsernameArgs = {
  username: Scalars["String"]["input"];
};

export type QueryCheckRegisteredUsernameArgs = {
  username: Scalars["String"]["input"];
};

export type QueryGameSettingsArgs = {
  gameId: Scalars["ID"]["input"];
};

export type RoomCreatedResult = {
  __typename?: "RoomCreatedResult";
  inviteCode: Scalars["String"]["output"];
  roomID: Scalars["ID"]["output"];
  wsAuthCode: Scalars["String"]["output"];
};

export type RoomJoinedResult = {
  __typename?: "RoomJoinedResult";
  roomID: Scalars["ID"]["output"];
  wsAuthCode: Scalars["String"]["output"];
};

export type Ship = {
  __typename?: "Ship";
  shipID: Scalars["ID"]["output"];
  size: Scalars["Int"]["output"];
  type: ShipClassName;
};

export enum ShipClassName {
  Battleship = "BATTLESHIP",
  Carrier = "CARRIER",
  Cruiser = "CRUISER",
  Destroyer = "DESTROYER",
  Submarine = "SUBMARINE",
}

export enum ShipOrientation {
  Horizontal = "HORIZONTAL",
  Vertical = "VERTICAL",
}

export type ShipPlacementInput = {
  orientation: ShipOrientation;
  position: CoordinateInput;
  shipID: Scalars["ID"]["input"];
};

export type ShipsPlacedResult = {
  __typename?: "ShipsPlacedResult";
  gameRoomStatus: GameRoomStatus;
  placedShips: Array<PlacedShip>;
};

export type UsernameQueryResult = {
  __typename?: "UsernameQueryResult";
  taken: Scalars["Boolean"]["output"];
  username: Scalars["String"]["output"];
  validationError?: Maybe<Scalars["String"]["output"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  Coordinate: ResolverTypeWrapper<Coordinate>;
  CoordinateInput: CoordinateInput;
  GameRoomStatus: ResolverTypeWrapper<GameRoomStatus>;
  GameSettings: ResolverTypeWrapper<GameSettings>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Mutation: ResolverTypeWrapper<{}>;
  PlacedShip: ResolverTypeWrapper<PlacedShip>;
  Player: ResolverTypeWrapper<Player>;
  Query: ResolverTypeWrapper<{}>;
  RoomCreatedResult: ResolverTypeWrapper<RoomCreatedResult>;
  RoomJoinedResult: ResolverTypeWrapper<RoomJoinedResult>;
  Ship: ResolverTypeWrapper<Ship>;
  ShipClassName: ShipClassName;
  ShipOrientation: ShipOrientation;
  ShipPlacementInput: ShipPlacementInput;
  ShipsPlacedResult: ResolverTypeWrapper<ShipsPlacedResult>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  UsernameQueryResult: ResolverTypeWrapper<UsernameQueryResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars["Boolean"]["output"];
  Coordinate: Coordinate;
  CoordinateInput: CoordinateInput;
  GameRoomStatus: GameRoomStatus;
  GameSettings: GameSettings;
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  LoginResult: LoginResult;
  Mutation: {};
  PlacedShip: PlacedShip;
  Player: Player;
  Query: {};
  RoomCreatedResult: RoomCreatedResult;
  RoomJoinedResult: RoomJoinedResult;
  Ship: Ship;
  ShipPlacementInput: ShipPlacementInput;
  ShipsPlacedResult: ShipsPlacedResult;
  String: Scalars["String"]["output"];
  UsernameQueryResult: UsernameQueryResult;
};

export type CoordinateResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["Coordinate"] = ResolversParentTypes["Coordinate"],
> = {
  x?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  y?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameRoomStatusResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["GameRoomStatus"] = ResolversParentTypes["GameRoomStatus"],
> = {
  currentPlayerID?: Resolver<
    Maybe<ResolversTypes["ID"]>,
    ParentType,
    ContextType
  >;
  opponent?: Resolver<Maybe<ResolversTypes["Player"]>, ParentType, ContextType>;
  opponentShipsPlaced?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  opponentSocketConnected?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  player?: Resolver<ResolversTypes["Player"], ParentType, ContextType>;
  playerShipsPlaced?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  playerSocketConnected?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameSettingsResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["GameSettings"] = ResolversParentTypes["GameSettings"],
> = {
  availableShips?: Resolver<
    Array<ResolversTypes["Ship"]>,
    ParentType,
    ContextType
  >;
  boardHeight?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  boardWidth?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  turnDuration?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["LoginResult"] = ResolversParentTypes["LoginResult"],
> = {
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  userID?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
  createRoom?: Resolver<
    ResolversTypes["RoomCreatedResult"],
    ParentType,
    ContextType
  >;
  guestLogin?: Resolver<
    Maybe<ResolversTypes["LoginResult"]>,
    ParentType,
    ContextType,
    Partial<MutationGuestLoginArgs>
  >;
  joinRoom?: Resolver<
    ResolversTypes["RoomJoinedResult"],
    ParentType,
    ContextType,
    RequireFields<MutationJoinRoomArgs, "inviteCode">
  >;
  placeShips?: Resolver<
    Maybe<ResolversTypes["ShipsPlacedResult"]>,
    ParentType,
    ContextType,
    RequireFields<MutationPlaceShipsArgs, "roomID" | "shipPlacements">
  >;
  registerUser?: Resolver<
    Maybe<ResolversTypes["LoginResult"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRegisterUserArgs, "email" | "password" | "username">
  >;
  registeredLogin?: Resolver<
    Maybe<ResolversTypes["LoginResult"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRegisteredLoginArgs, "password" | "username">
  >;
};

export type PlacedShipResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["PlacedShip"] = ResolversParentTypes["PlacedShip"],
> = {
  orientation?: Resolver<
    ResolversTypes["ShipOrientation"],
    ParentType,
    ContextType
  >;
  position?: Resolver<ResolversTypes["Coordinate"], ParentType, ContextType>;
  ship?: Resolver<ResolversTypes["Ship"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["Player"] = ResolversParentTypes["Player"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  checkGuestUsername?: Resolver<
    ResolversTypes["UsernameQueryResult"],
    ParentType,
    ContextType,
    RequireFields<QueryCheckGuestUsernameArgs, "username">
  >;
  checkRegisteredUsername?: Resolver<
    ResolversTypes["UsernameQueryResult"],
    ParentType,
    ContextType,
    RequireFields<QueryCheckRegisteredUsernameArgs, "username">
  >;
  gameSettings?: Resolver<
    ResolversTypes["GameSettings"],
    ParentType,
    ContextType,
    RequireFields<QueryGameSettingsArgs, "gameId">
  >;
  ping?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type RoomCreatedResultResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["RoomCreatedResult"] = ResolversParentTypes["RoomCreatedResult"],
> = {
  inviteCode?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  roomID?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  wsAuthCode?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomJoinedResultResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["RoomJoinedResult"] = ResolversParentTypes["RoomJoinedResult"],
> = {
  roomID?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  wsAuthCode?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["Ship"] = ResolversParentTypes["Ship"],
> = {
  shipID?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  size?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["ShipClassName"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipsPlacedResultResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["ShipsPlacedResult"] = ResolversParentTypes["ShipsPlacedResult"],
> = {
  gameRoomStatus?: Resolver<
    ResolversTypes["GameRoomStatus"],
    ParentType,
    ContextType
  >;
  placedShips?: Resolver<
    Array<ResolversTypes["PlacedShip"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsernameQueryResultResolvers<
  ContextType = ApolloContext,
  ParentType extends
    ResolversParentTypes["UsernameQueryResult"] = ResolversParentTypes["UsernameQueryResult"],
> = {
  taken?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  validationError?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = ApolloContext> = {
  Coordinate?: CoordinateResolvers<ContextType>;
  GameRoomStatus?: GameRoomStatusResolvers<ContextType>;
  GameSettings?: GameSettingsResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PlacedShip?: PlacedShipResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RoomCreatedResult?: RoomCreatedResultResolvers<ContextType>;
  RoomJoinedResult?: RoomJoinedResultResolvers<ContextType>;
  Ship?: ShipResolvers<ContextType>;
  ShipsPlacedResult?: ShipsPlacedResultResolvers<ContextType>;
  UsernameQueryResult?: UsernameQueryResultResolvers<ContextType>;
};

export type GuestLoginMutationVariables = Exact<{
  username?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GuestLoginMutation = {
  __typename?: "Mutation";
  guestLogin?: {
    __typename?: "LoginResult";
    accessToken: string;
    expiresAt: string;
    username: string;
    userID: string;
  } | null;
};

export type RegisteredLoginMutationVariables = Exact<{
  username: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type RegisteredLoginMutation = {
  __typename?: "Mutation";
  registeredLogin?: {
    __typename?: "LoginResult";
    accessToken: string;
    expiresAt: string;
    username: string;
    userID: string;
  } | null;
};

export type CreateRoomMutationVariables = Exact<{ [key: string]: never }>;

export type CreateRoomMutation = {
  __typename?: "Mutation";
  createRoom: {
    __typename?: "RoomCreatedResult";
    roomID: string;
    inviteCode: string;
    wsAuthCode: string;
  };
};

export type JoinRoomMutationVariables = Exact<{
  inviteCode: Scalars["String"]["input"];
}>;

export type JoinRoomMutation = {
  __typename?: "Mutation";
  joinRoom: {
    __typename?: "RoomJoinedResult";
    roomID: string;
    wsAuthCode: string;
  };
};

export type PlaceShipsMutationVariables = Exact<{
  roomId: Scalars["ID"]["input"];
  shipPlacements: Array<ShipPlacementInput> | ShipPlacementInput;
}>;

export type PlaceShipsMutation = {
  __typename?: "Mutation";
  placeShips?: {
    __typename?: "ShipsPlacedResult";
    gameRoomStatus: {
      __typename?: "GameRoomStatus";
      playerShipsPlaced: boolean;
      playerSocketConnected: boolean;
      opponentShipsPlaced: boolean;
      opponentSocketConnected: boolean;
      currentPlayerID?: string | null;
      player: { __typename?: "Player"; id: string; username: string };
      opponent?: { __typename?: "Player"; id: string; username: string } | null;
    };
    placedShips: Array<{
      __typename?: "PlacedShip";
      orientation: ShipOrientation;
      ship: {
        __typename?: "Ship";
        shipID: string;
        size: number;
        type: ShipClassName;
      };
      position: { __typename?: "Coordinate"; x: number; y: number };
    }>;
  } | null;
};

export type CheckGuestUsernameQueryVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type CheckGuestUsernameQuery = {
  __typename?: "Query";
  checkGuestUsername: {
    __typename?: "UsernameQueryResult";
    taken: boolean;
    username: string;
    validationError?: string | null;
  };
};

export type CheckRegisteredUsernameQueryVariables = Exact<{
  username: Scalars["String"]["input"];
}>;

export type CheckRegisteredUsernameQuery = {
  __typename?: "Query";
  checkRegisteredUsername: {
    __typename?: "UsernameQueryResult";
    taken: boolean;
    username: string;
    validationError?: string | null;
  };
};

export type GameSettingsQueryVariables = Exact<{
  gameId: Scalars["ID"]["input"];
}>;

export type GameSettingsQuery = {
  __typename?: "Query";
  gameSettings: {
    __typename?: "GameSettings";
    boardHeight: number;
    boardWidth: number;
    turnDuration: number;
    availableShips: Array<{
      __typename?: "Ship";
      shipID: string;
      size: number;
      type: ShipClassName;
    }>;
  };
};
