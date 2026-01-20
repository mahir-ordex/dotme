export const queries = `
  getAllTweets: [Tweet]
  getPresignUrl(imageType: String!, imageName: String!): String
  
  # Paginated queries
  getTweetsPaginated(page: Int!, limit: Int!): TweetConnection!
  searchTweets(query: String!, page: Int!, limit: Int!): TweetConnection!
`;