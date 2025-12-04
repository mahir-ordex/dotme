"use client"
import { Search, Bell, Mail, User, MoreHorizontal, Home as HomeIcon, Hash, Bookmark, Users, Zap, Settings, HelpCircle, ImageIcon, Smile, BarChart3, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavbarProps = {
    user: {
        id?: string | null;
        profileImage?: string | null;
        firstName?: string | null;
        lastName?: string | null;
    };
};

export const Navbar = ({ user }: NavbarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: HomeIcon, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/explore" },
        { icon: Bell, label: "Notifications", href: "/notifications" },
        { icon: Mail, label: "Messages", href: "/messages" },
        { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
        { icon: Users, label: "Communities", href: "/communities" },
        { icon: Zap, label: "Premium", href: "/premium" },
        { icon: User, label: "Profile", href: user.id ? `/${user.id}` : "/profile" },
        { icon: MoreHorizontal, label: "More", href: "/more" }
    ];

    return (
        <div className="w-64 xl:w-80 border-r border-gray-800 fixed h-full overflow-y-auto bg-black">
            <div className="p-4">
                {/* X Logo */}
                <div className="w-8 h-8 mb-8 ml-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1 mb-8">
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.href || "/"}>
                            <button
                                className={`${pathname === item.href ? "font-bold text-white" : "font-normal"} flex items-center space-x-4 px-3 py-3 rounded-full transition-all duration-200 hover:bg-gray-900 group w-fit`}
                            >
                                <item.icon
                                    className={`w-6 h-6 ${pathname === item.href ? 'fill-white' : ''}`}
                                    strokeWidth={pathname === item.href ? 3 : 2}
                                />
                                <span className="text-xl hidden xl:block">{item.label}</span>
                            </button>
                        </Link>
                    ))}
                </nav>

                {/* Post Button */}
                <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] w-full xl:w-auto xl:px-8 py-3 rounded-full font-bold text-white transition-colors mb-8">
                    <span className="hidden xl:block">Post</span>
                    <svg className="w-6 h-6 xl:hidden mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H8.8c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z"></path>
                    </svg>
                </button>
            </div>

            {/* User Profile Section */}
            <div className="absolute bottom-4 left-4 right-4">
                <Link href={user.id ? `/${user.id}` : "/profile"}>
                    <button className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 transition-colors w-full">
                        <img
                            src={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 text-left hidden xl:block">
                            <div className="font-bold text-[15px] leading-5">
                                {user?.firstName} {user?.lastName || ""}
                            </div>
                            <div className="text-gray-500 text-[15px] leading-5">
                                @{user?.firstName?.toLowerCase().replace(/\s+/g, '')}{user?.lastName?.toLowerCase() || ""}
                            </div>
                        </div>
                        <MoreHorizontal className="w-5 h-5 hidden xl:block" />
                    </button>
                </Link>
            </div>
        </div>
    );
};