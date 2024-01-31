import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
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
  placeShips: GameRoomStatus;
  registerUser?: Maybe<LoginResult>;
  registeredLogin?: Maybe<LoginResult>;
};


export type MutationguestLoginArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationjoinRoomArgs = {
  inviteCode: Scalars['String']['input'];
};


export type MutationplaceShipsArgs = {
  roomID: Scalars['ID']['input'];
  shipPlacements: Array<ShipPlacement>;
};


export type MutationregisterUserArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationregisteredLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  checkUsername: UsernameQueryResult;
  gameSettings: GameSettings;
  ping: Scalars['String']['output'];
};


export type QuerycheckUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QuerygameSettingsArgs = {
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

export type ShipClassName =
  | 'BATTLESHIP'
  | 'CARRIER'
  | 'CRUISER'
  | 'DESTROYER'
  | 'SUBMARINE';

export type ShipOrientation =
  | 'HORIZONTAL'
  | 'VERTICAL';

export type ShipPlacement = {
  orientation: ShipOrientation;
  shipID: Scalars['ID']['input'];
  x: Scalars['Int']['input'];
  y: Scalars['Int']['input'];
};

export type UsernameQueryResult = {
  __typename?: 'UsernameQueryResult';
  taken: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
  validationError?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  GameRoomStatus: ResolverTypeWrapper<GameRoomStatus>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  GameSettings: ResolverTypeWrapper<GameSettings>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginResult: ResolverTypeWrapper<LoginResult>;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Query: ResolverTypeWrapper<{}>;
  RoomCreatedResult: ResolverTypeWrapper<RoomCreatedResult>;
  RoomJoinedResult: ResolverTypeWrapper<RoomJoinedResult>;
  Ship: ResolverTypeWrapper<Ship>;
  ShipClassName: ShipClassName;
  ShipOrientation: ShipOrientation;
  ShipPlacement: ShipPlacement;
  UsernameQueryResult: ResolverTypeWrapper<UsernameQueryResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  GameRoomStatus: GameRoomStatus;
  String: Scalars['String']['output'];
  Boolean: Scalars['Boolean']['output'];
  GameSettings: GameSettings;
  Int: Scalars['Int']['output'];
  LoginResult: LoginResult;
  Mutation: {};
  ID: Scalars['ID']['output'];
  Query: {};
  RoomCreatedResult: RoomCreatedResult;
  RoomJoinedResult: RoomJoinedResult;
  Ship: Ship;
  ShipPlacement: ShipPlacement;
  UsernameQueryResult: UsernameQueryResult;
};

export type GameRoomStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameRoomStatus'] = ResolversParentTypes['GameRoomStatus']> = {
  currentPlayer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  opponent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  opponentShipsPlaced?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  opponentSocketConnected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  playerShipsPlaced?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  playerSocketConnected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GameSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameSettings'] = ResolversParentTypes['GameSettings']> = {
  availableShips?: Resolver<Array<ResolversTypes['Ship']>, ParentType, ContextType>;
  boardHeight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  boardWidth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  turnDuration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResult'] = ResolversParentTypes['LoginResult']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createRoom?: Resolver<ResolversTypes['RoomCreatedResult'], ParentType, ContextType>;
  guestLogin?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, Partial<MutationguestLoginArgs>>;
  joinRoom?: Resolver<ResolversTypes['RoomJoinedResult'], ParentType, ContextType, RequireFields<MutationjoinRoomArgs, 'inviteCode'>>;
  placeShips?: Resolver<ResolversTypes['GameRoomStatus'], ParentType, ContextType, RequireFields<MutationplaceShipsArgs, 'roomID' | 'shipPlacements'>>;
  registerUser?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationregisterUserArgs, 'password' | 'username'>>;
  registeredLogin?: Resolver<Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<MutationregisteredLoginArgs, 'password' | 'username'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  checkUsername?: Resolver<ResolversTypes['UsernameQueryResult'], ParentType, ContextType, RequireFields<QuerycheckUsernameArgs, 'username'>>;
  gameSettings?: Resolver<ResolversTypes['GameSettings'], ParentType, ContextType, RequireFields<QuerygameSettingsArgs, 'gameId'>>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RoomCreatedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoomCreatedResult'] = ResolversParentTypes['RoomCreatedResult']> = {
  inviteCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  roomID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  wsAuthCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomJoinedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoomJoinedResult'] = ResolversParentTypes['RoomJoinedResult']> = {
  roomID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  wsAuthCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShipResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ship'] = ResolversParentTypes['Ship']> = {
  shipID?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ShipClassName'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsernameQueryResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsernameQueryResult'] = ResolversParentTypes['UsernameQueryResult']> = {
  taken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  validationError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  GameRoomStatus?: GameRoomStatusResolvers<ContextType>;
  GameSettings?: GameSettingsResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RoomCreatedResult?: RoomCreatedResultResolvers<ContextType>;
  RoomJoinedResult?: RoomJoinedResultResolvers<ContextType>;
  Ship?: ShipResolvers<ContextType>;
  UsernameQueryResult?: UsernameQueryResultResolvers<ContextType>;
};

