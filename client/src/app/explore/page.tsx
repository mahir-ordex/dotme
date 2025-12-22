"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ExplorePage() {
    const [query, setQuery] = useState("");
    // Placeholder for search results
    const [results, setResults] = useState<string[]>([]);

    // Dummy search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Replace with real search logic
        setResults(query ? [
            `Result for "${query}" #1`,
            `Result for "${query}" #2`,
            `Result for "${query}" #3`
        ] : []);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Explore</h1>
            <form onSubmit={handleSearch} className="flex items-center mb-8">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-l-full border border-gray-700 bg-gray-900 text-white focus:outline-none"
                    placeholder="Search for users, posts, or topics..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-full flex items-center"
                >
                    <Search className="w-5 h-5" />
                </button>
            </form>
            <div>
                {results.length === 0 && (
                    <div className="text-gray-500 text-center">No results yet. Try searching for something!</div>
                )}
                {results.length > 0 && (
                    <ul className="space-y-4">
                        {results.map((result, idx) => (
                            <li key={idx} className="bg-gray-800 rounded-lg p-4 text-white">
                                {result}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}