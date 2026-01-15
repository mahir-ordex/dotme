"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useGetAllUser, useGetCurrentUser } from "../../Hooks/user";
import Link from "next/link";
import XLayOut from "../components/xLayOut";
import { FollowBtn } from "../components/FollowBtn";

export default function ExplorePage() {
    const { data: currentUser, isLoading, error } = useGetCurrentUser();
    const [results, setResults] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const { data } = useGetAllUser(search);

    const rawUser = currentUser?.getCurrentUser || null;
    const user = rawUser ? {
        id: rawUser?.id,
        firstName: rawUser?.firstName || '',
        lastName: rawUser.lastName || '',
        profileImage: rawUser.profileImage || '',
        email: rawUser.email
    } : null;

    useEffect(() => {
        const id = setTimeout(() => {
            setResults(data?.getAllUser ?? []);
        }, 400); // debounce
        return () => clearTimeout(id);
    }, [search, data]);

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>;
    }
    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-400">Error loading user data.</div>;
    }
    if (!user) {
        return <div className="flex h-screen items-center justify-center text-gray-400">Please log in to explore users.</div>;
    }

    return (
        <XLayOut>
            <main className="flex-1 min-w-0 w-full md:max-w-[600px] border-r border-gray-800">
                <div className="sticky top-0 backdrop-blur-md bg-black/80 border-b border-gray-800 px-4 py-3 z-40">
                    <h1 className="text-xl font-bold">Explore</h1>
                </div>
                <div className="flex items-center mb-8 px-4 pt-4">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 rounded-l-full border border-gray-700 bg-gray-900 text-white focus:outline-none"
                        placeholder="Search for users, posts, or topics..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-r-full flex items-center">
                        <Search className="w-5 h-5" />
                    </span>
                </div>
                {results.length > 0 &&
                <div className="px-4">
                    {results.length === 0 ? (
                        <div className="text-gray-500 text-center">No results yet. Try searching for something!</div>
                    ) : (
                        <ul className="flex-col m-auto">
                            {results.map((result, idx) => (
                                <li key={idx} className="flex items-center justify-between bg-slate-950 rounded-lg p-4 text-white mb-2">
                                    <Link href={`/${result.id}`} className="flex items-center w-full">
                                    <div>
                                    </div>
                                        <img
                                            src={result.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                            alt={result.name || "User profile"}
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">{result.firstName} {result.lastName}</p>
                                            <p className="text-gray-400 text-sm">{result.email}</p>
                                        </div> 
                                    </Link>
                                        <div>
                                            <FollowBtn id={result.id}></FollowBtn>
                                        </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                }
                
            </main>
        </XLayOut>
    );
}