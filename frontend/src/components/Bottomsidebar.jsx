import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreatePost from "./ui/CreatePost";

export default function Bottomsidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Home"
  );

  const createPostHandler = () => {
    setOpen(true);
  };

  const sidebarHandler = (textType) => {
    if (textType === "Create") {
      createPostHandler();
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    } else if (textType === "Search") {
      navigate("/search");
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
    { icon: <Home size={22} />, text: "Home" },
    { icon: <Search size={22} />, text: "Search" },
    // { icon: <TrendingUp size={22} />, text: "Explore" },
    { icon: <MessageCircle size={22} />, text: "Messages" },
    // { icon: <Heart size={22} />, text: "Notifications" },
    { icon: <PlusSquare size={22} />, text: "Create" },
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
    // { icon: <LogOut size={22} />, text: "Logout" },
  ];

  return (
    <>
      {/* Bottom navbar visible only on small screens */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-300 z-10 flex justify-around items-center py-2  md:hidden">
        {SidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.text)}
            className={`flex flex-col items-center text-sm  ${
              currentTab === item.text
                ? "bg-blue-500 text-white px-5 py-1"
                : "hover:bg-gray-100"
            } select-none`}
          >
            {item.icon}
            <span className="hidden lg:block text-base md:text-sm lg:text-base font-medium">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* CreatePost modal */}
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}
