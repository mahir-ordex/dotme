import { redirect } from 'next/navigation';
import { graphQLContext } from '../../interfaces';
import Razorpay from "razorpay";
import { prisma } from '../../utils/prismaClient';
import * as crypto from 'crypto';

const instance = new Razorpay({
    key_id: process.env.REZORPAY_KEY_ID!,
    key_secret: process.env.REZORPAY_KEY_SECRET!,
});


const resolvers = {
    createOrder: async (_: any, { amount, plan }: { amount: number, plan: string }, ctx: graphQLContext) => {
        if (plan === 'premium') {
            amount = 10
        }
        const order = await instance.orders.create({
            amount: amount * 100, // paise
            currency: "INR",
        });

        const user = await prisma.user.findFirst({
            where:{
                id:ctx.user.id
            }
        })
        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            razorpayOrderId: order.id,
            userName:`${user?.firstName} + ${user?.lastName}`,
            dp: `${user?.profileImage}`
        };
    },
    paymentVerify: async (parent: any, { payload }: { payload: any }, ctx: graphQLContext) => {
        if (!ctx || !ctx.user.id) {
            throw new Error("Unauthenticated!")
        }

        try{
            const { order_id, razorpay_payment_id, razorpay_signature, plan } = payload || {};
    
            const generatedSignature = crypto
                .createHmac('sha256', process.env.REZORPAY_KEY_SECRET!)
                .update(order_id + "|" + razorpay_payment_id)
                .digest('hex');
    
            const isMatched = generatedSignature === razorpay_signature;
            if(isMatched){
                // Calculate end date (e.g., 30 days from now for premium)
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30);
                
                await prisma.premiumSubscription.create({
                    data: {
                        userId: ctx.user.id,
                        paymentId: razorpay_payment_id,
                        endDate: endDate,
                        plan: plan,
                    }
                }) 
                
                return {
                    success: true,
                    message: "Payment verified successfully"
                }
            } else {
                throw new Error("Payment verification failed")
            }
        } catch(e: any) {
            console.error(e)
            throw new Error(e.message)
        }
    }
};


export default resolvers;