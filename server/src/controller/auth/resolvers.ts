import axios from "axios";
import { prisma } from "../../utils/prismaClient.js"
import JwtServices from "../../utils/jwtServices.js";


const resolvers = {
    Query: {
        verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
            const googleToken = token;
            const googleOAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo")
            googleOAuthUrl.searchParams.set("id_token", googleToken)
            googleOAuthUrl.searchParams.set("id_token", googleToken)

            const { data } = await axios.get(googleOAuthUrl.toString(),
                {
                    responseType: "json"
                })


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

                return JwtServices.generateToken(newUser)
            }
            return JwtServices.generateToken(user)
        },
    }
}

export default resolvers