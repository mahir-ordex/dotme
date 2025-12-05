import { createTweetMutation } from './../graphql/mutation/tweet';
import { CreateTweetInput } from '../gql/graphql';
import { graphQLClient } from '../client/api';
import { getAllTweetsQuery } from "../graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RequestDocument } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';

export const useGetAllTweet = () => {
    const query = useQuery({
        queryKey: ['all-tweet'],
        queryFn: async () => {
            // Add authentication headers like in your other hooks
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            
            const client = new GraphQLClient('http://localhost:8000/graphql', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const result = await client.request(getAllTweetsQuery as any);
            return result;
        },
        enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
        retry: false,
    })
    return {...query, tweets: query.data?.getAllTweets}
}

export const createTweet = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async (payload: CreateTweetInput) => {
            console.log("payload :", payload);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            
            const client = new GraphQLClient('http://localhost:8000/graphql', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return client.request(
                createTweetMutation as unknown as RequestDocument, 
                { payload }
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