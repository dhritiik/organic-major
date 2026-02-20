import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full h-14 pl-14 pr-6 bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-2xl hover:bg-gray-800/60 text-lg"
                    placeholder="Search for a molecule..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>
        </div>
    );
};

export default SearchBar;
