// d:\social-app\.Me\client\src\graphql\query\user.ts
import { graphql } from '../../gql/gql'

export const verifyGoogleTokenQuery = graphql(`
  query VerifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`)

export const getCurrentUserQuery = graphql(`
  query getCurrentUserQuery {
    getCurrentUser {
      id
      firstName
      lastName
      email
      profileImage
      tweets {
        id
        content
        imageUrl
        createdAt
      }
      follower {
        id
        firstName
        lastName
        profileImage
      }
      following {
        id
        firstName
        lastName
        profileImage
      }
    }
  }
`)

export const getUserByIdQuery = graphql(`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      id
      email
      firstName
      lastName
      profileImage
      tweets {
        id
        content
        imageUrl
        createdAt
      }
      follower {
        id
        firstName
        lastName
        profileImage
      }
      following {
        id
        firstName
        lastName
        profileImage
      }
    }
  }
`)