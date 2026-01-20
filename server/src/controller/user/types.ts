export const types = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    profileImage: String
    coverImage: String
    bio: String
    location: String
    createdAt: String
    tweets: [Tweet]
    follower: [User]
    following: [User]
  }
  input UpdateUserInput {
    firstName: String
    lastName: String
    profileImage: String
    coverImage: String
    bio: String
    location: String
    }
`;
