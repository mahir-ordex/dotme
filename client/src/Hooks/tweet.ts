
import { createTweetMutation } from './../graphql/mutation/tweet';
import { CreateTweetInput } from '@/gql/graphql';
import { graphQLClient } from '../client/api';
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RequestDocument } from 'graphql-request';
export const useGetAllTweet = () => {
    const query = useQuery({
        queryKey: ['all-tweet'],
        queryFn: async () => await graphQLClient.request(getAllTweetsQuery as any)
    })
    return {...query, tweets: query.data?.getAllTweets}
}

export const createTweet = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetInput) => {
            console.log("payload :", payload);
            // Ensure proper variable structure
            return graphQLClient.request(
                createTweetMutation as unknown as RequestDocument, 
                { payload } // Wrap payload in object with 'payload' key
            );
        },
        onSuccess: (data) => {
            console.log("Tweet created successfully:", data);
            // Invalidate queries to refresh the feed
            queryClient.invalidateQueries({
                queryKey: ['all-tweet']
            });
        },
        onError: (error) => {
            console.error("Error creating tweet:", error);
        }
    });
    
    return mutation;
}