import { graphql } from "../../gql";

export const createOrderMutation = `
    mutation createOrder($amount: Int!, $plan: String!) {
        createOrder(amount: $amount, plan: $plan) {
            currency
            amount
            razorpayOrderId
        }
    }
`;

export const paymentVerifyMutation = `
mutation paymentVerify($payload: PaymentVerifyInput!) {
  paymentVerify(payload: $payload) {
    success
    message
  }
}`