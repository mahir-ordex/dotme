export const mutations = `#graphql 
followUser(to: String): Boolean
unfollowUser(to: String): Boolean
UpdateUser(input: UpdateUserInput!): User
`