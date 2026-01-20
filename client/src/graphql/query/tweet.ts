import { graphql } from '../../gql/gql'

export const getAllTweetsQuery = graphql(`
    query getAllTweets{
    getAllTweets{
    id
    content
    imageUrl
    createdAt
    author{
    id
    firstName
    lastName
    profileImage
    }
    }
    }
  
`)

export const getPresignUrlQuery = graphql(`
  query GetPresignUrl($imageType: String!, $imageName: String!) {
    getPresignUrl(imageType: $imageType, imageName: $imageName)
  }
`)

export const getTweetsPaginatedQuery = graphql(`
  query GetTweetsPaginated($page: Int!, $limit: Int!) {
    getTweetsPaginated(page: $page, limit: $limit) {
      tweets {
        id
        content
        imageUrl
        createdAt
        author {
          id
          firstName
          lastName
          profileImage
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
      currentPage
      totalPages
    }
  }
`)
