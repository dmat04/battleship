/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  p1ShipsPlaced: Scalars['Boolean']['output'];
  p1WSOpen: Scalars['Boolean']['output'];
  p2ShipsPlaced: Scalars['Boolean']['output'];
  p2WSOpen: Scalars['Boolean']['output'];
  player1: Scalars['String']['output'];
  player2?: Maybe<Scalars['String']['output']>;
};

export type GameSettings = {
  __typename?: 'GameSettings';
  boardHeight: Scalars['Int']['output'];
  boardWidth: Scalars['Int']['output'];
  shipClasses: Array<ShipClass>;
  shipCounts: Array<ShipCount>;
};

export type LoginResult = {
  __typename?: 'LoginResult';
  accessToken: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createRoom: RoomCreatedResult;
  guestLogin?: Maybe<LoginResult>;
  joinRoom: RoomJoinedResult;
  placeShips: GameRoomStatus;
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
  shipPlacements: Array<ShipPlacement>;
};


export type MutationRegisterUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisteredLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  checkUsername: UsernameQueryResult;
  gameSettings: GameSettings;
  ping?: Maybe<Scalars['String']['output']>;
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

export type ShipClass = {
  __typename?: 'ShipClass';
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

export type ShipCount = {
  __typename?: 'ShipCount';
  class: ShipClassName;
  count: Scalars['Int']['output'];
};

export enum ShipOrientation {
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL'
}

export type ShipPlacement = {
  orientation: ShipOrientation;
  shipClass: ShipClassName;
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
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
  shipPlacements: Array<ShipPlacement> | ShipPlacement;
}>;


export type PlaceShipsMutation = { __typename?: 'Mutation', placeShips: { __typename?: 'GameRoomStatus', currentPlayer?: string | null, p1ShipsPlaced: boolean, p1WSOpen: boolean, p2ShipsPlaced: boolean, p2WSOpen: boolean, player1: string, player2?: string | null } };

export type CheckUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type CheckUsernameQuery = { __typename?: 'Query', checkUsername: { __typename?: 'UsernameQueryResult', taken: boolean, username: string, validationError?: string | null } };

export type GameSettingsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type GameSettingsQuery = { __typename?: 'Query', gameSettings: { __typename?: 'GameSettings', boardHeight: number, boardWidth: number, shipClasses: Array<{ __typename?: 'ShipClass', size: number, type: ShipClassName }>, shipCounts: Array<{ __typename?: 'ShipCount', class: ShipClassName, count: number }> } };


export const GuestLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"guestLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guestLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GuestLoginMutation, GuestLoginMutationVariables>;
export const RegisteredLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registeredLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registeredLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<RegisteredLoginMutation, RegisteredLoginMutationVariables>;
export const CreateRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomID"}},{"kind":"Field","name":{"kind":"Name","value":"inviteCode"}},{"kind":"Field","name":{"kind":"Name","value":"wsAuthCode"}}]}}]}}]} as unknown as DocumentNode<CreateRoomMutation, CreateRoomMutationVariables>;
export const JoinRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"joinRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inviteCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomID"}},{"kind":"Field","name":{"kind":"Name","value":"wsAuthCode"}}]}}]}}]} as unknown as DocumentNode<JoinRoomMutation, JoinRoomMutationVariables>;
export const PlaceShipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"placeShips"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shipPlacements"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipPlacement"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"placeShips"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"shipPlacements"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shipPlacements"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentPlayer"}},{"kind":"Field","name":{"kind":"Name","value":"p1ShipsPlaced"}},{"kind":"Field","name":{"kind":"Name","value":"p1WSOpen"}},{"kind":"Field","name":{"kind":"Name","value":"p2ShipsPlaced"}},{"kind":"Field","name":{"kind":"Name","value":"p2WSOpen"}},{"kind":"Field","name":{"kind":"Name","value":"player1"}},{"kind":"Field","name":{"kind":"Name","value":"player2"}}]}}]}}]} as unknown as DocumentNode<PlaceShipsMutation, PlaceShipsMutationVariables>;
export const CheckUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taken"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"validationError"}}]}}]}}]} as unknown as DocumentNode<CheckUsernameQuery, CheckUsernameQueryVariables>;
export const GameSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardHeight"}},{"kind":"Field","name":{"kind":"Name","value":"boardWidth"}},{"kind":"Field","name":{"kind":"Name","value":"shipClasses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipCounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GameSettingsQuery, GameSettingsQueryVariables>;