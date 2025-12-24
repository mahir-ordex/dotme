"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useGetAllUser } from "../../Hooks/user";

export default function ExplorePage() {
    const [results, setResults] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const { data } = useGetAllUser(search);

    useEffect(() => {
        const id = setTimeout(() => {
            console.log("Search results:", data?.getAllUser);
            setResults(data?.getAllUser ?? []);
        }, 400); // debounce
        return () => clearTimeout(id);
    }, [search, data]);

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Explore</h1>
            <div className="flex items-center mb-8">
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
            <div>
                {results.length === 0 && (
                    <div className="text-gray-500 text-center">No results yet. Try searching for something!</div>
                )}
                {results.length > 0 && (
                    <ul className="space-y-4">
                        {results.map((result, idx) => (
                            <li key={idx} className="bg-gray-800 rounded-lg p-4 text-white">
                                {/* <img src={result.profileImage} alt="" /> */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}