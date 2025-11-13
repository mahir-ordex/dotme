import JWT from "jsonwebtoken"

const secret = process.env.secret || "Hello"
class JwtServices{
    public static async generateToken(user:any){
        const payload ={
            id:user.id,
            email:user.email
        }
        console.log("jwt secrate :",secret)
        const token = JWT.sign(payload,secret)

        return token
    }
    public static async verifyToken(token:string){

        const verifyUser = JWT.sign(token,secret)

        return verifyUser
    }
}

export default JwtServices