import { setAuthUser } from "@/redux/authSlice";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Menu,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./ui/CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";

export default function Leftsidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Home"
  );

  // const [mobileOpen, setMobileOpen] = useState(false); // For mobile menu toggle
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  const logouthandler = async () => {
    try {
      const res = await axios.get("https://momento-7gr6.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.message || "Logout failed");
    }
  };

  const createPostHandler = () => {
    setOpen(true);
    // setMobileOpen(false); // close mobile sidebar on create
  };

  const sidebarHandler = (textType) => {
    setActiveTab(textType);
    localStorage.setItem("activeTab", textType);
    if (textType === "Logout") {
      logouthandler();
    } else if (textType === "Create") {
      createPostHandler();
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
      setMobileOpen(false);
    } else if (textType === "Home") {
      navigate("/");
      // setMobileOpen(false);
    } else if (textType === "Messages") {
      navigate("/chat");
      // setMobileOpen(false);
    } else if (textType === "Notifications") {
      navigate("/notification");
    } else if (textType === "Search"){
      navigate("/search")
    }else if(textType==="Explore"){
      navigate("/explore")
    }
  };

  const routeToTab = {
    "/": "Home",
    "/search": "Search",
    "/explore": "Explore",
    "/chat": "Messages",
    "/notifications": "Notifications",
    "/create": "Create",
    [`/profile/${user?._id}`]: "Profile",
  };

  const currentTab = routeToTab[location.pathname] || activeTab;

  const SidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage
            className="h-6 w-6 rounded-full"
            src={user?.profilePicture}
            alt="@shadcn"
          />
          <AvatarFallback className="bg-black text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold">
            {user?.username?.slice(0, 2).toUpperCase() || "CN"}
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <>
      {/* Mobile Hamburger */}

      {/* Sidebar Container */}
      <div
        className={`hidden md:block w-[10%] lg:block fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-300
          transform transition-transform duration-300 ease-in-out
          w-64
            lg:w-[16%]
          flex flex-col
           
          `}
      >
        <div className="flex flex-col h-full p-4">
         <div className="flex items-center justify-center gap-1 ">
            <img className="hidden md:block h-12 w-12 rounded-full mb-8" src="/logo.png" alt="" />
            <h1 className="hidden lg:block mb-8 text-2xl font-sans bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text font-semi-bol">
              Momento
            </h1>
          </div>

          <nav className="flex flex-col space-y-3 flex-grow overflow-y-auto">
            {SidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={() => sidebarHandler(item.text)}
                className={`lg:flex items-center gap-3 relative cursor-pointer rounded-lg px-3 py-2 ${
                  currentTab === item.text
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                } select-none`}
              >
                {item.icon}
                <span className="hidden lg:block text-base md:text-sm lg:text-base font-medium">
                  {item.text}
                </span>
                

                {item.text === "Notifications" &&
                  Array.isArray(likeNotification) &&
                  likeNotification.length > 0 && (
                    <span className="absolute bottom-6 left-6 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {likeNotification.length}
                    </span>
                  )}
              </div>
            ))}
          </nav>
          <CreatePost className="" open={open} setOpen={setOpen} />
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {/* {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )} */}
    </>
  );
}
