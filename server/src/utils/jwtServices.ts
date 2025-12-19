import JWT from "jsonwebtoken"
import type { JWTUser } from "../interfaces.js"

const JWTsecret = process.env.JWTsecret || "$UperCase@2000"
class JwtServices{
    public static async generateToken(user:any){
        const payload: JWTUser ={
            id:user.id,
            email:user.email
        }
        console.log("jwt secrate :",JWTsecret)
        const token = JWT.sign(payload,JWTsecret)

        return token
    }
    public static async verifyToken(token:string){

        const verifyUser = JWT.verify(token,JWTsecret)

        return verifyUser
    }
    public static async decodeToken(authToken:string){
        if (!authToken){return null}
        // console.log("auth token :",authToken)
        return JWT.verify(authToken, JWTsecret) as JWTUser
    }
}

export default JwtServices