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
      coverImage
      location
      bio
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
      coverImage
      location
      bio
      createdAt
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

export const getAllUserQuery = graphql(`
  query getAllUser($search: String!) {
    getAllUser(search: $search) {
      firstName
      id
      lastName
      profileImage
    }
  }
`)

export const logOutQuery = graphql(`
  query LogOut {
    logOut
  }
`)