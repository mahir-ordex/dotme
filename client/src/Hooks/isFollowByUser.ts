import { User } from "../gql/graphql";

export const isFollowedByUser = (currentUser: User, id: string) => {
    if (!currentUser?.following || !Array?.isArray(currentUser?.following)) {
        return false;
    }

    const followIndex = currentUser.following.findIndex(user => user.id === id);
    const isFollowing = followIndex >= 0;

    console.log("isFollowedByUser:", isFollowing);

    return isFollowing;
}