// import { follow } from './../../../node_modules/.prisma/client/index.d';
import axios from "axios";
import { prisma } from "../../utils/prismaClient.js";
import JwtServices from "../../utils/jwtServices.js";
import type { graphQLContext } from "../../interfaces.js";
import type { User } from "../../../generated/prisma";
import { UserServices } from "../../utils/userServices.js";
import { client } from '../../utils/redisClient';

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
        logOut: async (parent: any, args: any, context: any) => {
            try {
                const { res } = context;
                res.clearCookie("token");
                return true;
            } catch (e) {
                console.error("Logout error:", e);
                return false;
            }
        },
        getCurrentUser: async (parent: any, args: any, context: any) => {
            if (!context.user) {
                return null;
            }
            return context.user;
        },
        getUserById: async (parent: any, { id }: { id: string }, context: graphQLContext) => {
            const idUser = await client.get(`_ID_${id}`)
            if (idUser) {
                return JSON.parse(idUser)
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            await client.setEx(`_ID_${id}`, (60 * 15), JSON.stringify(user))
            return user;
        },
        getAllUser: async (parent: any, { search }: { search: string }, ctx: graphQLContext) => {
            try {
                if (!ctx || !ctx.user) {
                    throw new Error("Unauthenticated!");
                }
                console.log("backend search :", search)

                const allUser = await prisma.user.findMany({
                    where: {
                        AND: [
                            {
                                id: { not: ctx.user.id }
                            },
                            {
                                OR: [
                                    {
                                        firstName: {
                                            contains: search.toLocaleLowerCase(),
                                            mode: "insensitive"
                                        }
                                    },
                                    {
                                        lastName: {
                                            contains: search.toLocaleLowerCase(),
                                            mode: "insensitive"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                });
                return allUser;
            } catch (e: any) {
                console.error(e)
                throw new Error(`${e.message}`)
            }

        }
    },
    Mutation: {
        followUser: async (parent: any, { to }: { to: string }, ctx: graphQLContext) => {
            if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated")

            await UserServices.followUser(ctx.user.id, to);
            return true
        },
        unfollowUser: async (parent: any, { to }: { to: string }, ctx: graphQLContext) => {
            if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");

            await UserServices.unfollowUser(ctx.user.id, to);
            return true;
        },
        UpdateUser: async (parent: any, { input }: { input: { firstName?: string; lastName?: string; profileImage?: string; coverImage?: string, bio?: string, location?: string } }, ctx: graphQLContext) => {
            if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
            const updatedUser = await UserServices.updateUser(ctx.user.id, input);
            return updatedUser;
        }


    }
};

const extraResolvers = {
    tweets: async (parent: User) => {
        return await prisma.tweet.findMany({
            where: {
                authorId: parent.id
            },
            orderBy: {
                createdAt: 'desc'
            },

        });
    },
    follower: async (parent: User) => {
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
    following: async (parent: User) => {
        const followRelations = await prisma.follow.findMany({
            where: {
                followerId: parent.id
            },
            include: {
                following: true
            }
        });
        return followRelations.map(relation => relation.following);
    },
};

export { resolvers, extraResolvers };
