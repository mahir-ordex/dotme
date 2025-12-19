import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Check, Zap, Heart, Shield, TrendingUp, Users, Star } from 'lucide-react';
import Link from 'next/link';
import PremiumClientActions from './PremiumClientActions';

export default async function PremiumPage() {
    // Get cookies on server side
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    // If no token, redirect to login
    if (!token) {
        redirect('/login');
    }

    const premiumFeatures = [
        { icon: Users, text: 'Support communities' },
        { icon: Shield, text: 'Ad-free experience' },
        { icon: Star, text: 'Exclusive premium content' },
        { icon: TrendingUp, text: 'Early access to new features' },
        { icon: Zap, text: 'Priority customer support' },
    ];

    const donationBenefits = [
        'Support open-source development',
        'Help maintain server costs',
        'Contribute to new feature development',
        'Support community events',
    ];
    

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-[600px] mx-auto border-x border-gray-800">
                <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800 px-4 py-3 flex items-center space-x-4">
                    <Link href="/" className="p-2 hover:bg-gray-900 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Premium</h1>
                    </div>
                </div>

                <div className="px-4 py-6">
                    {/* Title Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-8 h-8 text-yellow-500" />
                            <h2 className="text-3xl font-bold">Upgrade to Premium</h2>
                        </div>
                        <p className="text-gray-400">Unlock exclusive features and support our community</p>
                    </div>

                    {/* Premium Plan Card */}
                    <div className="border-2 border-blue-500 rounded-2xl p-6 mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Popular
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Premium Feature</h3>
                                <p className="text-2xl font-bold text-blue-400">₹10<span className="text-sm text-gray-400">/month</span></p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                What you get
                            </h4>
                            <ul className="space-y-3">
                                {premiumFeatures.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PremiumClientActions type="subscribe" />
                    </div>

                    {/* Donation Card */}
                    <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Donation Plan</h3>
                                <p className="text-sm text-gray-400">Support our mission</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-500" />
                                Your donation helps:
                            </h4>
                            <ul className="space-y-3">
                                {donationBenefits.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                                        <Check className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PremiumClientActions type="donate" />
                    </div>
                </div>
            </div>
        </div>
    );
}