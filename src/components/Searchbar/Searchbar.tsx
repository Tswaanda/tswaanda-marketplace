import React, { useState } from "react"

const SearchBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    }

    return (
        <div className="flex h-[50px] w-full md:w-2/5 bg-gray-200 border-primary p-1 border-[1px] rounded-[40px]">
            <form onSubmit={handleSubmit} className="flex">
                <input 
                    type="text" 
                    placeholder="Search for product..."
                    value={searchQuery}
                    className="text-gray-800 placeholder-gray-800 bg-transparent ml-[5%] w-[100%] focus:outline-none" 
                    onChange={handleInputChange}
                />
                <button 
                    className="flex justify-center items-center p-2 bg-primary hover:bg-gray-400 text-white w-[25%] rounded-[40px]"
                    type="submit"
                >
                    <svg width="auto" height="100%" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.3056 29.7721L39.9793 37.4441L37.4441 39.9793L29.7721 32.3056C26.9175 34.5939 23.3669 35.8386 19.7083 35.8333C10.8073 35.8333 3.58334 28.6093 3.58334 19.7083C3.58334 10.8073 10.8073 3.58334 19.7083 3.58334C28.6093 3.58334 35.8333 10.8073 35.8333 19.7083C35.8386 23.3669 34.5939 26.9175 32.3056 29.7721ZM28.7115 28.4427C30.9853 26.1044 32.2551 22.9699 32.25 19.7083C32.25 12.7782 26.6367 7.16668 19.7083 7.16668C12.7782 7.16668 7.16668 12.7782 7.16668 19.7083C7.16668 26.6367 12.7782 32.25 19.7083 32.25C22.9699 32.2551 26.1044 30.9853 28.4427 28.7115L28.7115 28.4427Z" fill="white"/>
                    </svg>
                </button>
            </form>

        </div>
    )
}

export default SearchBar