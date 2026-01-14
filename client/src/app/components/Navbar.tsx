"use client"
import { Search, Bell, Mail, User as UserIcon, MoreHorizontal, Home as HomeIcon, Hash, Bookmark, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Post from './post'
import { useState } from 'react';

type NavbarProps = {
    user: {
      profileImage: string;
      lastName: string;
      id : string,
      firstName: string,
    }
};

export const Navbar = ({ user }: NavbarProps) => {
    const pathname = usePathname();
    const [showPostModel, setShowPostModel] = useState(false);

    const menuItems = [
        { icon: HomeIcon, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/explore" },
        // { icon: Bell, label: "Notifications", href: "/notifications" },
        // { icon: Mail, label: "Messages", href: "/messages" },
        // { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
        // { icon: Users, label: "Communities", href: "/communities" },
        { icon: Zap, label: "Premium", href: "/premium" },
        { icon: UserIcon, label: "Profile", href: user.id ? `/${user.id}` : "/profile" },
        // { icon: MoreHorizontal, label: "More", href: "/more" }   
    ];

    return (
        <>
            {/* Overlay for Post Modal */}
            {/* {showPostModel && ( */}
                { showPostModel && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 z-[9998] transition-opacity">
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
                        <Post
                            userImage={user.profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                            homeComponent={true}
                            onClose={() => setShowPostModel(false)}
                        />
                    </div>
                    </div>
                )}
            {/* )} */}

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
                <div className="flex justify-around py-2">
                    {menuItems.slice(0, 5).map((item, index) => (
                        <Link key={index} href={item.href || "/"}>
                            <button 
                                className={`p-3 hover:bg-gray-900 rounded-full transition-colors ${
                                    pathname === item.href ? 'text-white' : 'text-gray-500'
                                }`}
                            >
                                <item.icon 
                                    className="w-6 h-6" 
                                    strokeWidth={pathname === item.href ? 2.5 : 2}
                                />
                            </button>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block md:w-16 lg:w-64 xl:w-80 border-r border-gray-800 fixed h-full overflow-y-auto bg-black">
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
                                    className={`${
                                        pathname === item.href ? "font-bold text-white" : "font-normal text-gray-300"
                                    } flex items-center space-x-4 px-3 py-3 rounded-full transition-all duration-200 hover:bg-gray-900 w-full lg:w-fit`}
                                >
                                    <item.icon
                                        className={`w-6 h-6 ${pathname === item.href ? 'fill-white' : ''}`}
                                        strokeWidth={pathname === item.href ? 3 : 2}
                                    />
                                    <span className="text-xl hidden lg:block">{item.label}</span>
                                </button>
                            </Link>
                        ))}
                    </nav>

                    {/* Post Button */}
                    <button className="bg-[#1d9bf0] hover:bg-[#1a8cd8] w-full lg:w-auto lg:px-8 py-3 rounded-full font-bold text-white transition-colors mb-8" onClick={() => setShowPostModel(true)}>
                        <span className="hidden lg:block">Post</span>
                        <svg className="w-6 h-6 lg:hidden mx-auto" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H8.8c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z"></path>
                        </svg>
                    </button>
                </div>

                {/* User Profile Section */}
                <div className="absolute bottom-4 left-4 right-4">
                    <Link href={user.id ? `/${user.id}` : "/profile"}>
                        <button className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 transition-colors w-full">
                            <img
                                src={user.profileImage ? user.profileImage : "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1 text-left hidden lg:block">
                                <div className="font-bold text-[15px] leading-5">
                                    {user?.firstName} {user?.lastName || ""}
                                </div>
                                <div className="text-gray-500 text-[15px] leading-5">
                                    @{user?.firstName?.toLowerCase().replace(/\s+/g, '')}{user?.lastName?.toLowerCase() || ""}
                                </div>
                            </div>
                            <MoreHorizontal className="w-5 h-5 hidden lg:block" />
                        </button>
                    </Link>
                </div>
                
            </div>
        </>
    );
};