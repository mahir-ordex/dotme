import { mutations } from './../../../server/src/controller/user/mutation';
import { useMutation } from "@tanstack/react-query"
import { graphQLClient } from "../client/api"
import { createOrderMutation, paymentVerifyMutation } from "../graphql/mutation/order"

type CreateOrderPayload = {
    amount: number;
    plan: string;
};

export const createOrderId = () => {
    const mutation = useMutation({
        mutationFn: async (payload: CreateOrderPayload) => {
            const response = await graphQLClient.request(createOrderMutation as any, {
                amount: payload.amount,
                plan: payload.plan
            });
            return response.createOrder;
        }
    });
    return mutation;
};

export const useVerifyPayment = () => {
    const mutation = useMutation({
        mutationFn: async(payload:any) => {
            const response = await graphQLClient.request(paymentVerifyMutation,{
                payload
            })
            console.log(response)
            return response
        }
    });
    return mutation
};