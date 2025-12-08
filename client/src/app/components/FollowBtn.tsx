import { useFollowUser, useUnFollowUser, useGetCurrentUser } from "../../Hooks/user"
import { isFollowedByUser } from "../../Hooks/isFollowByUser"
import { User } from "../../gql/graphql";
import { QueryClient } from "@tanstack/react-query";

export const FollowBtn = ({id}: {id: string}) => {
    const { mutateAsync: followUser, isPending: isFollowing } = useFollowUser();
    const { mutateAsync: unfollowUser, isPending: isUnfollowing } = useUnFollowUser();
    const { data: currentUserData } = useGetCurrentUser();
    
    const isFollowed = currentUserData?.getCurrentUser ? isFollowedByUser(currentUserData.getCurrentUser as User, id) : false;
    
    const handleToggleFollow = async () => {
        if (isFollowed) {
            await unfollowUser(id);
        } else {
            await followUser(id);
        }
    }

    const isLoading = isFollowing || isUnfollowing;

    return (
        <button 
            onClick={handleToggleFollow}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                isFollowed 
                    ? 'bg-transparent border border-gray-600 text-white hover:bg-red-600 hover:border-red-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isLoading ? 'Loading...' : isFollowed ? 'Following' : 'Follow'}
        </button>
    )
}