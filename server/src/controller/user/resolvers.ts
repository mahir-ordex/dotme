import axios from "axios";
import { prisma } from "../../utils/prismaClient.js";
import JwtServices from "../../utils/jwtServices.js";
import type { graphQLContext } from "../../interfaces.js";
import type { User } from "@prisma/client";

const resolvers = {
    Query: {
        verifyGoogleToken: async (parent: any, { token }: { token: string }, ctx: any) => {
            const googleToken = token;
            console.log("google token : ", googleToken)
            const googleOAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
            googleOAuthUrl.searchParams.set("id_token", googleToken);

            const { res } = ctx;

            let jwtToken: string | undefined;

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
                    
                    // Set cookie using Express method
                    res.cookie('__twitter_token__', jwtToken, {
                        httpOnly: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });
                    
                    return jwtToken;
                }
                
                jwtToken = await JwtServices.generateToken(user);
                
                // Set cookie using Express method
                res.cookie('__twitter_token__', jwtToken, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                
                return jwtToken;

            } catch (e: any) {
                console.log("error :", e)
                throw new Error("Authentication failed");
            }
        },
        getCurrentUser: async (parent: any, args: any, context: any) => {
            console.log('Context user:', context.user);
            if (!context.user) {
                return null;
            }
            return context.user;
        },
        getUserById: async (parent: any, { id }: { id: string }) => {
            return await prisma.user.findUnique({
                where: {
                    id: id
                },
            });
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
            }
        });
    }
};

export { resolvers, extraResolvers };
