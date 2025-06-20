import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersBySearch } from "../redux/searchSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";

function Search() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.search);

  const handleChange = (e) => setText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(fetchUsersBySearch(text));
    }
  };

  useEffect(() => {
    console.log("Users:", users);
  }, [users]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="search"
            value={text}
            onChange={handleChange}
            placeholder="Search users..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 bottom-2 px-4 py-1 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      {/* Display search results */}
      <div className="mt-4 px-[5%] md:pl-[12%] lg:pl-[17%] ">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && users?.length === 0 && text.trim() && (
          <p className="text-gray-500">No users found.</p>
        )}
        {users?.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-4 border p-2 rounded-sm"
          >
            <Link to={`/profile/${user?._id}`}>
              <Avatar>
                <AvatarImage
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.profilePicture}
                  alt="@shadcn"
                />
                <AvatarFallback className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
                  {user?.username?.slice(0, 2).toUpperCase() || "CN"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link to={`/profile/${user?._id}`}>
              <p className="font-bold">{user.username}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
