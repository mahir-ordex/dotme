import { prisma } from "../../utils/prismaClient.js";

interface CreateTweetPayload {
    content: string;
    imageUrl?: string;
}

interface GraphQLContext {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
    };
}

const mutations = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetPayload }, ctx: GraphQLContext) => {
        try {
            if (!ctx.user) throw new Error("Please Authenticate First");
            
            const tweet = await prisma.tweet.create({
                data: {
                    content: payload.content,
                    imageUrl: payload.imageUrl ?? null,
                    authorId: ctx.user.id,
                },
                include: {
                    author: true
                }
            });
            
            return tweet;
        } catch (error) {
            console.error('Error creating tweet:', error);
            throw new Error('Failed to create tweet');
        }
    }
};

const queries = {
    getAllTweets: async () => {
        try {
            const tweets = await prisma.tweet.findMany({
                include: {
                    author: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            return tweets;
        } catch (error) {
            console.error('Error fetching tweets:', error);
            throw new Error('Failed to fetch tweets');
        }
    }
};

export const resolvers = { 
    Mutation: mutations, 
    Query: queries
};