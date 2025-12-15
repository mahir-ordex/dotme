import { graphQLContext } from '../../interfaces';
import { client } from '../../utils/redisClient';
import Razorpay from "razorpay";


var instance = new Razorpay({
key_id: process.env.REZORPAY_KEY_ID!,
key_secret: process.env.REZORPAY_KEY_SECRET!,
});
const resolvers = {
    createPayment: async (parent:any,orderOptions:any,ctx:graphQLContext) => {
         const res  = await instance.orders.create({
            amount:orderOptions.amount,
            currency: "INR",
            receipt: "order_rcptid_11"
         },(err,order) => {
            console.log("ordexr :",order)
         })
         console.log("createpayment : res : ",res)
         return orderOptions.amount
    }
}
export default resolvers