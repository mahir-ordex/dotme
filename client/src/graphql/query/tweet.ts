import { graphql } from '@/gql'

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
