export const mutations = `#graphql 
        createOrder(amount: Int!, plan: String!): Order!
        paymentVerify(payload: PaymentVerifyInput!): PaymentVerifyResponse!
`