export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type GameRoomStatus = {
  __typename?: 'GameRoomStatus';
  currentPlayer?: Maybe<Scalars['String']['output']>;
  opponent?: Maybe<Scalars['String']['output']>;
  opponentShipsPlaced: Scalars['Boolean']['output'];
  opponentSocketConnected: Scalars['Boolean']['output'];
  player: Scalars['String']['output'];
  playerShipsPlaced: Scalars['Boolean']['output'];
  playerSocketConnected: Scalars['Boolean']['output'];
};

export type GameSettings = {
  __typename?: 'GameSettings';
  availableShips: Array<Ship>;
  boardHeight: Scalars['Int']['output'];
  boardWidth: Scalars['Int']['output'];
  turnDuration: Scalars['Int']['output'];
};

export type LoginResult = {
  __typename?: 'LoginResult';
  accessToken: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRoom: RoomCreatedResult;
  guestLogin?: Maybe<LoginResult>;
  joinRoom: RoomJoinedResult;
  placeShips?: Maybe<ShipsPlacedResult>;
  registerUser?: Maybe<LoginResult>;
  registeredLogin?: Maybe<LoginResult>;
};


export type MutationGuestLoginArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationJoinRoomArgs = {
  inviteCode: Scalars['String']['input'];
};


export type MutationPlaceShipsArgs = {
  roomID: Scalars['ID']['input'];
  shipPlacements: Array<ShipPlacementInput>;
};


export type MutationRegisterUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisteredLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type PlacedShip = {
  __typename?: 'PlacedShip';
  orientation: ShipOrientation;
  ship: Ship;
  x: Scalars['Int']['output'];
  y: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  checkUsername: UsernameQueryResult;
  gameSettings: GameSettings;
  ping: Scalars['String']['output'];
};


export type QueryCheckUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryGameSettingsArgs = {
  gameId: Scalars['ID']['input'];
};

export type RoomCreatedResult = {
  __typename?: 'RoomCreatedResult';
  inviteCode: Scalars['String']['output'];
  roomID: Scalars['ID']['output'];
  wsAuthCode: Scalars['String']['output'];
};

export type RoomJoinedResult = {
  __typename?: 'RoomJoinedResult';
  roomID: Scalars['ID']['output'];
  wsAuthCode: Scalars['String']['output'];
};

export type Ship = {
  __typename?: 'Ship';
  shipID: Scalars['ID']['output'];
  size: Scalars['Int']['output'];
  type: ShipClassName;
};

export enum ShipClassName {
  Battleship = 'BATTLESHIP',
  Carrier = 'CARRIER',
  Cruiser = 'CRUISER',
  Destroyer = 'DESTROYER',
  Submarine = 'SUBMARINE'
}

export enum ShipOrientation {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

export type ShipPlacementInput = {
  orientation: ShipOrientation;
  shipID: Scalars['ID']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
};

export type ShipsPlacedResult = {
  __typename?: 'ShipsPlacedResult';
  gameRoomStatus: GameRoomStatus;
  placedShips: Array<PlacedShip>;
};

export type UsernameQueryResult = {
  __typename?: 'UsernameQueryResult';
  taken: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
  validationError?: Maybe<Scalars['String']['output']>;
};

export type GuestLoginMutationVariables = Exact<{
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type GuestLoginMutation = { __typename?: 'Mutation', guestLogin?: { __typename?: 'LoginResult', accessToken: string, expiresAt: string, username: string } | null };

export type RegisteredLoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisteredLoginMutation = { __typename?: 'Mutation', registeredLogin?: { __typename?: 'LoginResult', accessToken: string, expiresAt: string, username: string } | null };

export type CreateRoomMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'RoomCreatedResult', roomID: string, inviteCode: string, wsAuthCode: string } };

export type JoinRoomMutationVariables = Exact<{
  inviteCode: Scalars['String']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: { __typename?: 'RoomJoinedResult', roomID: string, wsAuthCode: string } };

export type PlaceShipsMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
  shipPlacements: Array<ShipPlacementInput> | ShipPlacementInput;
}>;


export type PlaceShipsMutation = { __typename?: 'Mutation', placeShips?: { __typename?: 'ShipsPlacedResult', gameRoomStatus: { __typename?: 'GameRoomStatus', currentPlayer?: string | null, opponent?: string | null, opponentShipsPlaced: boolean, opponentSocketConnected: boolean, player: string, playerShipsPlaced: boolean, playerSocketConnected: boolean }, placedShips: Array<{ __typename?: 'PlacedShip', orientation: ShipOrientation, x: number, y: number, ship: { __typename?: 'Ship', shipID: string, size: number, type: ShipClassName } }> } | null };

export type CheckUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type CheckUsernameQuery = { __typename?: 'Query', checkUsername: { __typename?: 'UsernameQueryResult', taken: boolean, username: string, validationError?: string | null } };

export type GameSettingsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type GameSettingsQuery = { __typename?: 'Query', gameSettings: { __typename?: 'GameSettings', boardHeight: number, boardWidth: number, turnDuration: number, availableShips: Array<{ __typename?: 'Ship', shipID: string, size: number, type: ShipClassName }> } };
