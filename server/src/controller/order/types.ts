export const typeDefs = `#graphql
    type Order {
        id: String!
        amount: Int!
        currency: String!
        razorpayOrderId: String!
    }

    type Subscription {
        id: ID!
        userId: String!
        plan: String!
        status: String!
        currentPeriodEnd: String
    }

    type Payment {
        id: ID!
        amount: Int!
        currency: String!
        status: String!
        razorpayPaymentId: String
        createdAt: String!
    }

    input PaymentVerifyInput {
        order_id: String!
        razorpay_payment_id: String!
        razorpay_signature: String!
        plan: String!
    }

    type PaymentVerifyResponse {
        success: Boolean!
        message: String!
    }
`;