/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation guestLogin($username: String) {\n    guestLogin(username: $username) {\n      accessToken\n      expiresAt\n      username\n    }\n  }\n": types.GuestLoginDocument,
    "\n  mutation registeredLogin($username: String!, $password: String!) {\n    registeredLogin(username: $username, password: $password) {\n      accessToken\n      expiresAt\n      username\n    }\n  }\n": types.RegisteredLoginDocument,
    "\n  mutation createRoom {\n    createRoom {\n      roomID\n      inviteCode\n      wsAuthCode\n    }\n  }\n": types.CreateRoomDocument,
    "\n  mutation joinRoom($inviteCode: String!) {\n    joinRoom(inviteCode: $inviteCode) {\n      roomID\n      wsAuthCode\n    }\n  }\n": types.JoinRoomDocument,
    "\n  query GameSettings($gameId: ID!) {\n    gameSettings(gameId: $gameId) {\n      boardHeight\n      boardWidth\n      shipClasses {\n        size\n        type\n      }\n      shipCounts {\n        class\n        count\n      }\n    }\n}\n": types.GameSettingsDocument,
    "\n  query checkUsername($username: String!) {\n    checkUsername(username: $username) {\n      taken\n      username\n      validationError\n    }\n  }\n": types.CheckUsernameDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation guestLogin($username: String) {\n    guestLogin(username: $username) {\n      accessToken\n      expiresAt\n      username\n    }\n  }\n"): (typeof documents)["\n  mutation guestLogin($username: String) {\n    guestLogin(username: $username) {\n      accessToken\n      expiresAt\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation registeredLogin($username: String!, $password: String!) {\n    registeredLogin(username: $username, password: $password) {\n      accessToken\n      expiresAt\n      username\n    }\n  }\n"): (typeof documents)["\n  mutation registeredLogin($username: String!, $password: String!) {\n    registeredLogin(username: $username, password: $password) {\n      accessToken\n      expiresAt\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation createRoom {\n    createRoom {\n      roomID\n      inviteCode\n      wsAuthCode\n    }\n  }\n"): (typeof documents)["\n  mutation createRoom {\n    createRoom {\n      roomID\n      inviteCode\n      wsAuthCode\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation joinRoom($inviteCode: String!) {\n    joinRoom(inviteCode: $inviteCode) {\n      roomID\n      wsAuthCode\n    }\n  }\n"): (typeof documents)["\n  mutation joinRoom($inviteCode: String!) {\n    joinRoom(inviteCode: $inviteCode) {\n      roomID\n      wsAuthCode\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GameSettings($gameId: ID!) {\n    gameSettings(gameId: $gameId) {\n      boardHeight\n      boardWidth\n      shipClasses {\n        size\n        type\n      }\n      shipCounts {\n        class\n        count\n      }\n    }\n}\n"): (typeof documents)["\n  query GameSettings($gameId: ID!) {\n    gameSettings(gameId: $gameId) {\n      boardHeight\n      boardWidth\n      shipClasses {\n        size\n        type\n      }\n      shipCounts {\n        class\n        count\n      }\n    }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query checkUsername($username: String!) {\n    checkUsername(username: $username) {\n      taken\n      username\n      validationError\n    }\n  }\n"): (typeof documents)["\n  query checkUsername($username: String!) {\n    checkUsername(username: $username) {\n      taken\n      username\n      validationError\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;