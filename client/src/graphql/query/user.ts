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
    }
  }
`)
