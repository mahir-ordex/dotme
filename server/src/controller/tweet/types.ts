export const types = `#graphql
  type Tweet {
    id: ID!
    content: String!
    imageUrl: [String]
    author: User!
    createdAt: String!
  }

  input CreateTweetInput {
    content: String!
    imageUrl: [String]
  }

  type TweetConnection {
    tweets: [Tweet!]!
    totalCount: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
    }
`;