import * as Types from '@battleship/common/types/types.generated';
import { GraphQLResolveInfo } from 'graphql';
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };


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
) => Types.Maybe<TTypes> | Promise<Types.Maybe<TTypes>>;

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
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']['output']>;
  GameRoomStatus: ResolverTypeWrapper<Types.GameRoomStatus>;
  GameSettings: ResolverTypeWrapper<Types.GameSettings>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']['output']>;
  LoginResult: ResolverTypeWrapper<Types.LoginResult>;
  Mutation: ResolverTypeWrapper<{}>;
  PlacedShip: ResolverTypeWrapper<Types.PlacedShip>;
  Query: ResolverTypeWrapper<{}>;
  RoomCreatedResult: ResolverTypeWrapper<Types.RoomCreatedResult>;
  RoomJoinedResult: ResolverTypeWrapper<Types.RoomJoinedResult>;
  Ship: ResolverTypeWrapper<Types.Ship>;
  ShipClassName: Types.ShipClassName;
  ShipOrientation: Types.ShipOrientation;
  ShipPlacementInput: Types.ShipPlacementInput;
  ShipsPlacedResult: ResolverTypeWrapper<Types.ShipsPlacedResult>;
  String: ResolverTypeWrapper<Types.Scalars['String']['output']>;
  UsernameQueryResult: ResolverTypeWrapper<Types.UsernameQueryResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Types.Scalars['Boolean']['output'];
  GameRoomStatus: Types.GameRoomStatus;
  GameSettings: Types.GameSettings;
  ID: Types.Scalars['ID']['output'];
  Int: Types.Scalars['Int']['output'];
  LoginResult: Types.LoginResult;
  Mutation: {};
  PlacedShip: Types.PlacedShip;
  Query: {};
  RoomCreatedResult: Types.RoomCreatedResult;
  RoomJoinedResult: Types.RoomJoinedResult;
  Ship: Types.Ship;
  ShipPlacementInput: Types.ShipPlacementInput;
  ShipsPlacedResult: Types.ShipsPlacedResult;
  String: Types.Scalars['String']['output'];
  UsernameQueryResult: Types.UsernameQueryResult;
};

export type GameRoomStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameRoomStatus'] = ResolversParentTypes['GameRoomStatus']> = {
  currentPlayer?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  opponent?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  guestLogin?: Resolver<Types.Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, Partial<Types.MutationGuestLoginArgs>>;
  joinRoom?: Resolver<ResolversTypes['RoomJoinedResult'], ParentType, ContextType, RequireFields<Types.MutationJoinRoomArgs, 'inviteCode'>>;
  placeShips?: Resolver<Types.Maybe<ResolversTypes['ShipsPlacedResult']>, ParentType, ContextType, RequireFields<Types.MutationPlaceShipsArgs, 'roomID' | 'shipPlacements'>>;
  registerUser?: Resolver<Types.Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<Types.MutationRegisterUserArgs, 'password' | 'username'>>;
  registeredLogin?: Resolver<Types.Maybe<ResolversTypes['LoginResult']>, ParentType, ContextType, RequireFields<Types.MutationRegisteredLoginArgs, 'password' | 'username'>>;
};

export type PlacedShipResolvers<ContextType = any, ParentType extends ResolversParentTypes['PlacedShip'] = ResolversParentTypes['PlacedShip']> = {
  orientation?: Resolver<ResolversTypes['ShipOrientation'], ParentType, ContextType>;
  ship?: Resolver<ResolversTypes['Ship'], ParentType, ContextType>;
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  checkUsername?: Resolver<ResolversTypes['UsernameQueryResult'], ParentType, ContextType, RequireFields<Types.QueryCheckUsernameArgs, 'username'>>;
  gameSettings?: Resolver<ResolversTypes['GameSettings'], ParentType, ContextType, RequireFields<Types.QueryGameSettingsArgs, 'gameId'>>;
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

export type ShipsPlacedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShipsPlacedResult'] = ResolversParentTypes['ShipsPlacedResult']> = {
  gameRoomStatus?: Resolver<ResolversTypes['GameRoomStatus'], ParentType, ContextType>;
  placedShips?: Resolver<Array<ResolversTypes['PlacedShip']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsernameQueryResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UsernameQueryResult'] = ResolversParentTypes['UsernameQueryResult']> = {
  taken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  validationError?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  GameRoomStatus?: GameRoomStatusResolvers<ContextType>;
  GameSettings?: GameSettingsResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PlacedShip?: PlacedShipResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RoomCreatedResult?: RoomCreatedResultResolvers<ContextType>;
  RoomJoinedResult?: RoomJoinedResultResolvers<ContextType>;
  Ship?: ShipResolvers<ContextType>;
  ShipsPlacedResult?: ShipsPlacedResultResolvers<ContextType>;
  UsernameQueryResult?: UsernameQueryResultResolvers<ContextType>;
};

