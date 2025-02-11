import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Fetch the authenticated user (if needed)
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/profile/${searchInput}`);
      const data = await res.json();
      if (!res.ok || !data) throw new Error("User not found");

      // Redirect to the searched user's profile page
      navigate(`/profile/${data.username}`);
    } catch (error) {
      toast.error("User not found");
    }
  };

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-6">Search Users</h2>
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center justify-center mt-4 px-2 w-full"
        >
          <div className="relative w-full max-w-md">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-gray-800 text-white rounded-full outline-none h-10"
            />
          </div>
          <button
            type="submit"
            className="ml-2 py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </form>
      </div>
      {/* Optionally, you can display search results or user info here */}
    </div>
  );
};

export default SearchPage;
