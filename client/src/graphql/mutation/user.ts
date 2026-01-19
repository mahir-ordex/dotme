import { graphql } from "../../gql";

export const followUserMutation = graphql(`
    mutation FollowUser($to: String) {
  followUser(to: $to)
}`)

export const unFollowUserMutation = graphql(`
    mutation UnfollowUser($to: String) {
  unfollowUser(to: $to)
}
`)

export const updateUserMutation = graphql(`
    mutation UpdateUser($input: UpdateUserInput!) {
  UpdateUser(input: $input) {
    id
    firstName
    lastName
    profileImage
    coverImage
    bio
    location
  }
}`)