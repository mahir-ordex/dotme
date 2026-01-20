// d:\social-app\.Me\client\src\Hooks\user.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query' // ✅ Import useQueryClient
import { getAllUserQuery, getCurrentUserQuery, getUserByIdQuery, logOutQuery } from '../graphql/query/user';
import { graphQLClient } from '../client/api';
import { followUserMutation, unFollowUserMutation, updateUserMutation } from '../graphql/mutation/user';
import { RequestDocument } from 'graphql-request';
import { on } from 'events';

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ['id', id],
    queryFn: async () => {
      const result = await graphQLClient.request(getUserByIdQuery as any, { id });
      return result.getUserById;
    },
    enabled: !!id,
  });
};

export const useGetCurrentUser = () => {
    const query = useQuery({
        queryKey:['current-user'],
        queryFn: async() => {
            const data = await graphQLClient.request(getCurrentUserQuery);
            console.log("Fetched current user:", data.getCurrentUser);
            return data;
        },
        staleTime: 0, // Always fetch fresh data
    })
    return {...query, data: query.data}
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            console.log('Mutation called with id:', id);
            return graphQLClient.request(followUserMutation, { to: id });
        },
        onSuccess: async (data, id) => {
            console.log('Mutation success:', data);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['current-user'] }),
                queryClient.invalidateQueries({ queryKey: ['id', id] })
            ]);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
    return mutation;
}

export const useUnFollowUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await graphQLClient.request(unFollowUserMutation, { to: id });
            console.log('Mutation response:', res);
            return res;
        },
        onSuccess: async (_data, id) => {
            // Invalidate both current user and target user queries
            console.log('Invalidating queries for current-user and id', id);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['current-user'] }),
                queryClient.invalidateQueries({ queryKey: ['id', id] })
            ]);
            console.log('Successfully unfollowed user!');
        },
        onError: (error) => {
            // Let UI handle error, but log for debugging
            console.error("Error in Unfollow User:", error);
        }
    });
    return mutation;
}

export const useGetAllUser = (search:string) =>{
    const query = useQuery({
        queryKey: ['getAllUser', search],
        queryFn: async () => {
            console.log("hook search ::   :: : : :",search)
            let result  = await graphQLClient.request(getAllUserQuery as any, { search });
            return result
        },
        enabled: !!search,
    })
    return {...query,data:query.data}
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (input: { firstName?: string; lastName?: string; profileImage?: string; coverImage?: string, bio?: string, location?: string }) => {
            return graphQLClient.request(updateUserMutation, { input });
        },
        onSuccess: async (data) => {
            console.log('User updated successfully:', data);
            await queryClient.invalidateQueries({ queryKey: ['current-user'] });
        },
        onError: (error) => {
            console.error('Error updating user:', error);
        }
    })
    return mutation;
}

export const useLogOut = () => {
    const queryClient = useQueryClient();
    
    const query = useQuery({
        queryKey: ['log-out'],
        queryFn: async () => {
            const data = await graphQLClient.request(logOutQuery as any);
            return data;
        },
        enabled: false, // Don't run automatically - only when refetch is called
    });

    return { ...query, logout: query.refetch };
}
