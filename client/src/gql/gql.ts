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
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    mutation CreateTweet($payload: CreateTweetInput!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n": typeof types.CreateTweetDocument,
    "\n    mutation FollowUser($to: String) {\n  followUser(to: $to)\n}": typeof types.FollowUserDocument,
    "\n    mutation UnfollowUser($to: String) {\n  unfollowUser(to: $to)\n}\n": typeof types.UnfollowUserDocument,
    "\n    mutation UpdateUser($input: UpdateUserInput!) {\n  UpdateUser(input: $input) {\n    id\n    firstName\n    lastName\n    profileImage\n    coverImage\n    bio\n    location\n  }\n}": typeof types.UpdateUserDocument,
    "\n    query getAllTweets{\n    getAllTweets{\n    id\n    content\n    imageUrl\n    createdAt\n    author{\n    id\n    firstName\n    lastName\n    profileImage\n    }\n    }\n    }\n  \n": typeof types.GetAllTweetsDocument,
    "\n  query GetPresignUrl($imageType: String!, $imageName: String!) {\n    getPresignUrl(imageType: $imageType, imageName: $imageName)\n  }\n": typeof types.GetPresignUrlDocument,
    "\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": typeof types.VerifyGoogleTokenDocument,
    "\n  query getCurrentUserQuery {\n    getCurrentUser {\n      id\n      firstName\n      lastName\n      email\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n": typeof types.GetCurrentUserQueryDocument,
    "\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n": typeof types.GetUserByIdDocument,
    "\n  query getAllUser($search: String!) {\n    getAllUser(search: $search) {\n      firstName\n      id\n      lastName\n      profileImage\n    }\n  }\n": typeof types.GetAllUserDocument,
};
const documents: Documents = {
    "\n    mutation CreateTweet($payload: CreateTweetInput!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n": types.CreateTweetDocument,
    "\n    mutation FollowUser($to: String) {\n  followUser(to: $to)\n}": types.FollowUserDocument,
    "\n    mutation UnfollowUser($to: String) {\n  unfollowUser(to: $to)\n}\n": types.UnfollowUserDocument,
    "\n    mutation UpdateUser($input: UpdateUserInput!) {\n  UpdateUser(input: $input) {\n    id\n    firstName\n    lastName\n    profileImage\n    coverImage\n    bio\n    location\n  }\n}": types.UpdateUserDocument,
    "\n    query getAllTweets{\n    getAllTweets{\n    id\n    content\n    imageUrl\n    createdAt\n    author{\n    id\n    firstName\n    lastName\n    profileImage\n    }\n    }\n    }\n  \n": types.GetAllTweetsDocument,
    "\n  query GetPresignUrl($imageType: String!, $imageName: String!) {\n    getPresignUrl(imageType: $imageType, imageName: $imageName)\n  }\n": types.GetPresignUrlDocument,
    "\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyGoogleTokenDocument,
    "\n  query getCurrentUserQuery {\n    getCurrentUser {\n      id\n      firstName\n      lastName\n      email\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n": types.GetCurrentUserQueryDocument,
    "\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  query getAllUser($search: String!) {\n    getAllUser(search: $search) {\n      firstName\n      id\n      lastName\n      profileImage\n    }\n  }\n": types.GetAllUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CreateTweet($payload: CreateTweetInput!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation CreateTweet($payload: CreateTweetInput!){\n        createTweet(payload: $payload){\n            id\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation FollowUser($to: String) {\n  followUser(to: $to)\n}"): (typeof documents)["\n    mutation FollowUser($to: String) {\n  followUser(to: $to)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UnfollowUser($to: String) {\n  unfollowUser(to: $to)\n}\n"): (typeof documents)["\n    mutation UnfollowUser($to: String) {\n  unfollowUser(to: $to)\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateUser($input: UpdateUserInput!) {\n  UpdateUser(input: $input) {\n    id\n    firstName\n    lastName\n    profileImage\n    coverImage\n    bio\n    location\n  }\n}"): (typeof documents)["\n    mutation UpdateUser($input: UpdateUserInput!) {\n  UpdateUser(input: $input) {\n    id\n    firstName\n    lastName\n    profileImage\n    coverImage\n    bio\n    location\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query getAllTweets{\n    getAllTweets{\n    id\n    content\n    imageUrl\n    createdAt\n    author{\n    id\n    firstName\n    lastName\n    profileImage\n    }\n    }\n    }\n  \n"): (typeof documents)["\n    query getAllTweets{\n    getAllTweets{\n    id\n    content\n    imageUrl\n    createdAt\n    author{\n    id\n    firstName\n    lastName\n    profileImage\n    }\n    }\n    }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPresignUrl($imageType: String!, $imageName: String!) {\n    getPresignUrl(imageType: $imageType, imageName: $imageName)\n  }\n"): (typeof documents)["\n  query GetPresignUrl($imageType: String!, $imageName: String!) {\n    getPresignUrl(imageType: $imageType, imageName: $imageName)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  query VerifyGoogleToken($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getCurrentUserQuery {\n    getCurrentUser {\n      id\n      firstName\n      lastName\n      email\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n"): (typeof documents)["\n  query getCurrentUserQuery {\n    getCurrentUser {\n      id\n      firstName\n      lastName\n      email\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      id\n      email\n      firstName\n      lastName\n      profileImage\n      coverImage\n      location\n      bio\n      tweets {\n        id\n        content\n        imageUrl\n        createdAt\n      }\n      follower {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n      following {\n        id\n        firstName\n        lastName\n        profileImage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllUser($search: String!) {\n    getAllUser(search: $search) {\n      firstName\n      id\n      lastName\n      profileImage\n    }\n  }\n"): (typeof documents)["\n  query getAllUser($search: String!) {\n    getAllUser(search: $search) {\n      firstName\n      id\n      lastName\n      profileImage\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;