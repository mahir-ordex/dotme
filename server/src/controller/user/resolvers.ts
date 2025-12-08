import { follow } from './../../../node_modules/.prisma/client/index.d';
import axios from "axios";
import { prisma } from "../../utils/prismaClient.js";
import JwtServices from "../../utils/jwtServices.js";
import type { graphQLContext } from "../../interfaces.js";
import type { User } from "@prisma/client";
import { UserServices } from "../../utils/userServices.js";

const resolvers = {
    Query: {
        verifyGoogleToken: async (parent: any, { token }: { token: string }, context: any) => {
            const googleToken = token;
            console.log("google token : ", googleToken)
            const googleOAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
            googleOAuthUrl.searchParams.set("id_token", googleToken);

            const { res } = context
            let jwtToken: string | null = null;

            try {
                const { data } = await axios.get(googleOAuthUrl.toString(), {
                    responseType: "json"
                });

                console.log("Oauth response data : ", data)

                const user = await prisma.user.findUnique({
                    where: {
                        email: data.email
                    }
                });
                if (!user) {
                    const newUser = await prisma.user.create({
                        data: {
                            firstName: data.given_name,
                            lastName: data.family_name,
                            email: data.email,
                            profileImage: data.picture
                        }
                    });

                    jwtToken = await JwtServices.generateToken(newUser);
                    res.cookie("token", jwtToken);
                    return jwtToken;
                }
                jwtToken = await JwtServices.generateToken(user);
                    res.cookie("token", jwtToken, { httpOnly: true });
                    return jwtToken;

            } catch (e: any) {
                console.log("error :", e)
                return e
            }
        },
        getCurrentUser: async (parent: any, args: any, context: any) => {
            console.log('Context user:', context.user); // Debug log
            if (!context.user) {
                return null;
            }
            return context.user;
        },
        getUserById: async (parent: any, { id }: { id: string }, context: graphQLContext) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            return user;
        }
    },
    Mutation:{
        followUser: async(parent:any,{to}:{to: string},ctx:graphQLContext) => {
            if(!ctx.user || !ctx.user.id) throw new Error("Unauthenticated")

            await UserServices.followUser(ctx.user.id, to);
            return true
        },
        unfollowUser:  async(parent:any,{to}:{to: string},ctx:graphQLContext) => {
            if(!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");

            await UserServices.unfollowUser(ctx.user.id,to);
            return true;
        }

    }
};

const extraResolvers = {
    tweets: async (parent: User) => {
        return await prisma.tweet.findMany({
            where: {
                authorId: parent.id
            }
        });
    },
    follower: async(parent: User) => {
        const followRelations = await prisma.follow.findMany({
            where: {
                followingId: parent.id
            },
            include: {
                follower: true
            }
        });
        return followRelations.map(relation => relation.follower);
    },
    following: async(parent: User) => {
        const followRelations = await prisma.follow.findMany({
            where: {
                followerId: parent.id
            },
            include: {
                following: true
            }
        });
        return followRelations.map(relation => relation.following);
    }
};

export { resolvers, extraResolvers };
