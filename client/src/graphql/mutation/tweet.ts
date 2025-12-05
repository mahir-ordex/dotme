import { graphql } from "../../gql";

export const createTweetMutation = graphql(`
    mutation CreateTweet($payload: CreateTweetInput!){
        createTweet(payload: $payload){
            id
        }
    }
`)