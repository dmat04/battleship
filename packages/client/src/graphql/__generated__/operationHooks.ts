import * as Types from "@battleship/common/types/__generated__/types.generated.js";
import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;

export const GuestLoginDocument = gql`
  mutation guestLogin($username: String) {
    guestLogin(username: $username) {
      accessToken
      expiresAt
      username
    }
  }
`;
export type GuestLoginMutationFn = Apollo.MutationFunction<
  Types.GuestLoginMutation,
  Types.GuestLoginMutationVariables
>;

/**
 * __useGuestLoginMutation__
 *
 * To run a mutation, you first call `useGuestLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGuestLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [guestLoginMutation, { data, loading, error }] = useGuestLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGuestLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.GuestLoginMutation,
    Types.GuestLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.GuestLoginMutation,
    Types.GuestLoginMutationVariables
  >(GuestLoginDocument, options);
}
export type GuestLoginMutationHookResult = ReturnType<
  typeof useGuestLoginMutation
>;
export type GuestLoginMutationResult =
  Apollo.MutationResult<Types.GuestLoginMutation>;
export type GuestLoginMutationOptions = Apollo.BaseMutationOptions<
  Types.GuestLoginMutation,
  Types.GuestLoginMutationVariables
>;
export const RegisteredLoginDocument = gql`
  mutation registeredLogin($username: String!, $password: String!) {
    registeredLogin(username: $username, password: $password) {
      accessToken
      expiresAt
      username
    }
  }
`;
export type RegisteredLoginMutationFn = Apollo.MutationFunction<
  Types.RegisteredLoginMutation,
  Types.RegisteredLoginMutationVariables
>;

/**
 * __useRegisteredLoginMutation__
 *
 * To run a mutation, you first call `useRegisteredLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisteredLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registeredLoginMutation, { data, loading, error }] = useRegisteredLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisteredLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.RegisteredLoginMutation,
    Types.RegisteredLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.RegisteredLoginMutation,
    Types.RegisteredLoginMutationVariables
  >(RegisteredLoginDocument, options);
}
export type RegisteredLoginMutationHookResult = ReturnType<
  typeof useRegisteredLoginMutation
>;
export type RegisteredLoginMutationResult =
  Apollo.MutationResult<Types.RegisteredLoginMutation>;
export type RegisteredLoginMutationOptions = Apollo.BaseMutationOptions<
  Types.RegisteredLoginMutation,
  Types.RegisteredLoginMutationVariables
>;
export const CreateRoomDocument = gql`
  mutation createRoom {
    createRoom {
      roomID
      inviteCode
      wsAuthCode
    }
  }
`;
export type CreateRoomMutationFn = Apollo.MutationFunction<
  Types.CreateRoomMutation,
  Types.CreateRoomMutationVariables
>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateRoomMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.CreateRoomMutation,
    Types.CreateRoomMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.CreateRoomMutation,
    Types.CreateRoomMutationVariables
  >(CreateRoomDocument, options);
}
export type CreateRoomMutationHookResult = ReturnType<
  typeof useCreateRoomMutation
>;
export type CreateRoomMutationResult =
  Apollo.MutationResult<Types.CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<
  Types.CreateRoomMutation,
  Types.CreateRoomMutationVariables
>;
export const JoinRoomDocument = gql`
  mutation joinRoom($inviteCode: String!) {
    joinRoom(inviteCode: $inviteCode) {
      roomID
      wsAuthCode
    }
  }
`;
export type JoinRoomMutationFn = Apollo.MutationFunction<
  Types.JoinRoomMutation,
  Types.JoinRoomMutationVariables
>;

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinRoomMutation, { data, loading, error }] = useJoinRoomMutation({
 *   variables: {
 *      inviteCode: // value for 'inviteCode'
 *   },
 * });
 */
export function useJoinRoomMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.JoinRoomMutation,
    Types.JoinRoomMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.JoinRoomMutation,
    Types.JoinRoomMutationVariables
  >(JoinRoomDocument, options);
}
export type JoinRoomMutationHookResult = ReturnType<typeof useJoinRoomMutation>;
export type JoinRoomMutationResult =
  Apollo.MutationResult<Types.JoinRoomMutation>;
export type JoinRoomMutationOptions = Apollo.BaseMutationOptions<
  Types.JoinRoomMutation,
  Types.JoinRoomMutationVariables
>;
export const PlaceShipsDocument = gql`
  mutation placeShips($roomId: ID!, $shipPlacements: [ShipPlacementInput!]!) {
    placeShips(roomID: $roomId, shipPlacements: $shipPlacements) {
      gameRoomStatus {
        playerName
        playerID
        playerShipsPlaced
        playerSocketConnected
        opponentName
        opponentID
        opponentShipsPlaced
        opponentSocketConnected
        currentPlayerID
      }
      placedShips {
        orientation
        ship {
          shipID
          size
          type
        }
        position {
          x
          y
        }
      }
    }
  }
`;
export type PlaceShipsMutationFn = Apollo.MutationFunction<
  Types.PlaceShipsMutation,
  Types.PlaceShipsMutationVariables
>;

/**
 * __usePlaceShipsMutation__
 *
 * To run a mutation, you first call `usePlaceShipsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaceShipsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [placeShipsMutation, { data, loading, error }] = usePlaceShipsMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      shipPlacements: // value for 'shipPlacements'
 *   },
 * });
 */
export function usePlaceShipsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Types.PlaceShipsMutation,
    Types.PlaceShipsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Types.PlaceShipsMutation,
    Types.PlaceShipsMutationVariables
  >(PlaceShipsDocument, options);
}
export type PlaceShipsMutationHookResult = ReturnType<
  typeof usePlaceShipsMutation
>;
export type PlaceShipsMutationResult =
  Apollo.MutationResult<Types.PlaceShipsMutation>;
export type PlaceShipsMutationOptions = Apollo.BaseMutationOptions<
  Types.PlaceShipsMutation,
  Types.PlaceShipsMutationVariables
>;
export const CheckUsernameDocument = gql`
  query checkUsername($username: String!) {
    checkUsername(username: $username) {
      taken
      username
      validationError
    }
  }
`;

/**
 * __useCheckUsernameQuery__
 *
 * To run a query within a React component, call `useCheckUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useCheckUsernameQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.CheckUsernameQuery,
    Types.CheckUsernameQueryVariables
  > &
    (
      | { variables: Types.CheckUsernameQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.CheckUsernameQuery,
    Types.CheckUsernameQueryVariables
  >(CheckUsernameDocument, options);
}
export function useCheckUsernameLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.CheckUsernameQuery,
    Types.CheckUsernameQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.CheckUsernameQuery,
    Types.CheckUsernameQueryVariables
  >(CheckUsernameDocument, options);
}
export function useCheckUsernameSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.CheckUsernameQuery,
    Types.CheckUsernameQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.CheckUsernameQuery,
    Types.CheckUsernameQueryVariables
  >(CheckUsernameDocument, options);
}
export type CheckUsernameQueryHookResult = ReturnType<
  typeof useCheckUsernameQuery
>;
export type CheckUsernameLazyQueryHookResult = ReturnType<
  typeof useCheckUsernameLazyQuery
>;
export type CheckUsernameSuspenseQueryHookResult = ReturnType<
  typeof useCheckUsernameSuspenseQuery
>;
export type CheckUsernameQueryResult = Apollo.QueryResult<
  Types.CheckUsernameQuery,
  Types.CheckUsernameQueryVariables
>;
export const GameSettingsDocument = gql`
  query gameSettings($gameId: ID!) {
    gameSettings(gameId: $gameId) {
      boardHeight
      boardWidth
      turnDuration
      availableShips {
        shipID
        size
        type
      }
    }
  }
`;

/**
 * __useGameSettingsQuery__
 *
 * To run a query within a React component, call `useGameSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameSettingsQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *   },
 * });
 */
export function useGameSettingsQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.GameSettingsQuery,
    Types.GameSettingsQueryVariables
  > &
    (
      | { variables: Types.GameSettingsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.GameSettingsQuery,
    Types.GameSettingsQueryVariables
  >(GameSettingsDocument, options);
}
export function useGameSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.GameSettingsQuery,
    Types.GameSettingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.GameSettingsQuery,
    Types.GameSettingsQueryVariables
  >(GameSettingsDocument, options);
}
export function useGameSettingsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.GameSettingsQuery,
    Types.GameSettingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.GameSettingsQuery,
    Types.GameSettingsQueryVariables
  >(GameSettingsDocument, options);
}
export type GameSettingsQueryHookResult = ReturnType<
  typeof useGameSettingsQuery
>;
export type GameSettingsLazyQueryHookResult = ReturnType<
  typeof useGameSettingsLazyQuery
>;
export type GameSettingsSuspenseQueryHookResult = ReturnType<
  typeof useGameSettingsSuspenseQuery
>;
export type GameSettingsQueryResult = Apollo.QueryResult<
  Types.GameSettingsQuery,
  Types.GameSettingsQueryVariables
>;
