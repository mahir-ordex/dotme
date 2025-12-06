import { prisma } from "./prismaClient.js";

export class UserServices {
    public static async followUser(followerId: string, followingId: string): Promise<void> {
        await prisma.follow.create({
            data: {
                follower : {
                    connect : {id:followerId}
                },
                following : {
                    connect : {id : followingId}
                }

            }
        })
        
    }
    public static async unfollowUser(followerId: string, followingId: string): Promise<void> {
        await prisma.follow.delete({
            where : {
                followerId_followingId:{
                    followerId,
                    followingId
                }
            }
        })
    }
}