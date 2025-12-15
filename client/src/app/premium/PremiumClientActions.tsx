'use client';

import { useState } from 'react';
import { X, Heart } from 'lucide-react';
import Script from 'next/script';

type PremiumClientActionsProps = {
    type: 'subscribe' | 'donate';
};

export default function PremiumClientActions({ type }: PremiumClientActionsProps) {
    const [isOpenModule, setIsOpenModule] = useState(false);
    const [donationAmount, setDonationAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
         
        setTimeout(() => {
            alert('Redirecting to payment...');
            setLoading(false);
        }, 1000);
    };

    const handleDonate = async () => {
        if (!donationAmount || parseFloat(donationAmount) < 10) {
            alert('Minimum donation amount is ₹10');
            return;
        }
        setLoading(true);
        // TODO: Integrate Razorpay payment
        setTimeout(() => {
            alert(`Processing donation of ₹${donationAmount}...`);
            setLoading(false);
            setIsOpenModule(false);
            setDonationAmount("");
        }, 1000);
    };

    if (type === 'subscribe') {
        return (
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
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

            {/* Donation Modal */}
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