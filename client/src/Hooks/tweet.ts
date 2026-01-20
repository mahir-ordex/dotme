import { Tweet } from './../../../server/src/controller/tweet/index';
import { createTweetMutation } from './../graphql/mutation/tweet';
import { CreateTweetInput } from '../gql/graphql';
import { graphQLClient } from '../client/api';
import { getAllTweetsQuery, getTweetsPaginatedQuery } from "../graphql/query/tweet";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { RequestDocument } from 'graphql-request';


export const useGetAllTweet = () => {
    const query = useQuery({
        queryKey: ['all-tweet'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            
            const result = graphQLClient.request(getAllTweetsQuery as any);
        
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
            return graphQLClient.request(
                createTweetMutation as unknown as RequestDocument, 
                { payload }
            );
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['paginated-tweets']
            });
        },
        onError: (error) => {
            console.error("Error creating tweet:", error);
        }
    });
    
    return mutation;
}

export const usePaginatedTweets = (limit: number = 15) => {
    const query = useInfiniteQuery({
        queryKey: ['paginated-tweets', limit],
        queryFn: async ({ pageParam = 1 }) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }
            const result = await graphQLClient.request(getTweetsPaginatedQuery as any, { page: pageParam, limit });
            return result.getTweetsPaginated;
        },
        getNextPageParam: (lastPage: any) => {
            if (lastPage.hasNextPage) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
    const tweets = query.data?.pages.flatMap((page: any) => page.tweets) || [];
    return { ...query, tweets };
}
    