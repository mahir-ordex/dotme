'use client'
import { Children, useEffect } from "react";
import { Navbar } from "./Navbar";
import { useGetCurrentUser } from "../../Hooks/user";
import { useRouter } from "next/navigation";
import { RightSidebar } from "./RightSidebar";

const XLayOut = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { data: currentUser, isLoading, error } = useGetCurrentUser();
    const rawUser = currentUser?.getCurrentUser || null;

    const user = rawUser ? {
        id: rawUser?.id,
        firstName: rawUser?.firstName || '',
        lastName: rawUser.lastName || '',
        profileImage: rawUser.profileImage || '',
        email: rawUser.email
    } : null;

    useEffect(() => {
        const token = window.localStorage.getItem('token');

        if (!token || (error && !isLoading)) {
            console.log('No token or error, redirecting to login...');
            router.push('/login');
        }
    }, [error, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }


    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4 lg:w-1/6 xl:w-1/6 border-r border-gray-800">
                <Navbar user={user} />
            </aside>
            {/* Main Content */}
            <main className="flex-1 max-w-2xl mx-auto w-full px-2 md:px-6 py-4">
                {children}
            </main>
            {/* Right Sidebar */}
            <aside className="hidden xl:block xl:w-1/3
             2xl:w-1/4 border-l border-gray-800">
                <div className="sticky top-0 p-4">
                    <RightSidebar />
                </div>
            </aside>
        </div>
    );
}

export default XLayOut;