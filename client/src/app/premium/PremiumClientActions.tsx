'use client';

import { useState } from 'react';
import { X, Heart } from 'lucide-react';
import Script from 'next/script';
import { createOrderId, useVerifyPayment } from '../../Hooks/order';
import { useRouter } from 'next/navigation';

declare var Razorpay: any;

type PremiumClientActionsProps = {
    type: 'subscribe' | 'donate';
};

export default function PremiumClientActions({ type }: PremiumClientActionsProps) {
    const [isOpenModule, setIsOpenModule] = useState(false);
    const [donationAmount, setDonationAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutateAsync } = createOrderId();
    const { mutateAsync: verifyPayment } = useVerifyPayment();
    const router = useRouter();
    const handleDonate = async () => {
        if (!donationAmount || parseFloat(donationAmount) < 10) {
            alert('Minimum donation amount is ₹10');
            return;
        }
        setLoading(true);
        console.log('handleDonate called', { type, donationAmount });
        
        const payload = {
            amount: parseFloat(donationAmount),
            plan: type === 'subscribe' ? 'premium' : 'donation'
        };
        
        const { currency, amount, razorpayOrderId, userName, dp } = await mutateAsync(payload)
        const options = {
            key: process.env.NEXT_PUBLIC_KEY_REZORPAY!,
            amount: amount,
            currency: currency,
            name: "Acme Corp",
            order_id: razorpayOrderId,
            description: `Donation of ₹${donationAmount}`,
            // Removed order_id and callback_url - using handler instead
            handler: async function (response: any) {
                console.log('Payment successful:', response);
                 console.log(response.razorpay_payment_id);
                 console.log(response.razorpay_order_id);
                 console.log(response.razorpay_signature);
                alert(`Thank you for your donation! Payment ID: ${response.razorpay_payment_id}`);
                await verifyPayment({
                    order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    plan: type === 'subscribe' ? 'premium' : 'donation'
                }).then(() => {
                    setLoading(false);
                    if (type === 'subscribe') {
                        router.push(`/premium/success: ${response.razorpay_payment_id}`);
                    } else {
                        setIsOpenModule(false);
                        router.push('/premium/thank-you');
                    }
                    
                }).catch((err) => {
                    console.error('Payment verification failed:', err);
                    setLoading(false);
                });
            },
            prefill: {
                name: userName,
                email: "gaurav.kumar@example.com",
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            },
            modal: {
                ondismiss: function () {
                    console.log('Razorpay modal dismissed');
                    setLoading(false);
                }
            }
        };

        try {
            console.log('Razorpay env key:', process.env.NEXT_PUBLIC_KEY_REZORPAY);
            console.log('Razorpay options:', options);

            if (typeof Razorpay === 'undefined') {
                console.error('Razorpay is not loaded on window');
                alert('Payment gateway is not available. Please try again later.');
                setLoading(false);
                return;
            }

            const rzp1 = new Razorpay(options);

            rzp1.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });

            rzp1.open();
        } catch (err) {
            console.error('Error opening Razorpay checkout:', err);
            alert('Failed to open payment gateway.');
            setLoading(false);
        }
    };

    if (type === 'subscribe') {
        return (
            <button
                onClick={handleDonate}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                id='subscribe'
            >
                {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <button
                onClick={() => setIsOpenModule(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
                Donate
            </button>

            {/* Donation Module */}
            {isOpenModule && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full relative">
                        <button
                            onClick={() => setIsOpenModule(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-2">Enter Donation Amount</h3>
                            <p className="text-gray-400 text-center text-sm">Minimum donation: ₹10</p>
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                                <input
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    min="10"
                                    className="w-full bg-black border border-gray-700 rounded-xl px-12 py-3 text-xl font-bold focus:outline-none focus:border-pink-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>

                            {/* Quick amount buttons */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {[50, 100, 200, 500].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setDonationAmount(amt.toString())}
                                        className="bg-gray-800 hover:bg-gray-700 py-2 rounded-lg font-semibold text-sm transition-colors"
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsOpenModule(false)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-full font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDonate}
                                disabled={loading || !donationAmount || parseFloat(donationAmount) < 10}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 py-3 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                id='donate'
                            >
                                {loading ? 'Processing...' : 'Donate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}