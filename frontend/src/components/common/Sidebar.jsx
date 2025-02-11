import XSvg from "../svgs/X";
import { useState } from "react";
import { MdHomeFilled, MdSearch, MdPostAdd, MdMenu, MdBarChart } from "react-icons/md"; // Import MdBarChart icon
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import CreatePost from "../../pages/home/CreatePost.jsx"; // Import CreatePost component

const Sidebar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false); // State for post modal

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully!");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/users/profile/${searchInput}`);
      const data = await res.json();
      if (!res.ok || !data) throw new Error("User not found");
      navigate(`/profile/${data.username}`);
    } catch (error) {
      toast.error("User not found");
    }
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        {/* Logo */}
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>

        {/* Search Button */}
        <div className="flex justify-center md:justify-start mt-4">
          <Link
            to="/search"
            className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <MdSearch className="w-6 h-6" />
            <span className="text-lg hidden md:block">Search</span>
          </Link>
        </div>

        {/* Menu Button */}
        <div className="flex justify-center md:justify-start mt-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
          >
            <MdMenu className="w-6 h-6" />
            <span className="text-lg hidden md:block">Menu</span>
          </button>
        </div>

        {/* Conditional Menu Items */}
        {isMenuOpen && (
          <ul className="flex flex-col gap-3 mt-2">
            <li className="flex justify-center md:justify-start">
              <Link
                to="/settings"
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <span className="text-lg">Settings</span>
              </Link>
            </li>
            <li className="flex justify-center md:justify-start">
              <Link
                to="/about"
                className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                <span className="text-lg">About</span>
              </Link>
            </li>
          </ul>
        )}

        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>

          {/* Post Button */}
          <li className="flex justify-center md:justify-start">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdPostAdd className="w-6 h-6" />
              <span className="text-lg hidden md:block">Post</span>
            </button>
          </li>

          {/* Chart Button */}
          <li className="flex justify-center md:justify-start">
            <Link
              to="http://localhost:5001/login"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdBarChart className="w-6 h-6" />
              <span className="text-lg hidden md:block">Chart</span>
            </Link>
          </li>
        </ul>

        {/* Post Modal */}
        {isPostModalOpen && (
          <dialog open className="modal">
            <div className="modal-box border rounded-md border-gray-700 shadow-md">
              <h3 className="font-bold text-lg my-3">Create New Post</h3>
              <CreatePost />
              <button
                className="mt-4 btn btn-outline btn-sm"
                onClick={() => setIsPostModalOpen(false)}
              >
                Close
              </button>
            </div>
          </dialog>
        )}

        {/* Profile and Logout */}
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="avatar" />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
