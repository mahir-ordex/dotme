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
`;