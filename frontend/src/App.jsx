import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
// import Profile from './components/Profile'
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import Notification from "./components/Notification";
import Search from "./components/Search";
import { setMessages } from "./redux/chatSlice";
import Explore from "./components/Explore";
import Protected from "./components/Protected";


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<Protected><MainLayout /></Protected> ,
    children: [
      {
        path: "/",
        element: <Protected><Home /></Protected>,
      },
      {
        path: "/profile/:id",
        element: <Protected><Profile /></Protected>,
      },
      {
        path: "/account/edit",
        element: <Protected><EditProfile /></Protected>,
      },
      {
        path: "/chat",
        element: <Protected><ChatPage /></Protected>,
      },
       {
         path:"/notification",
         element:<Protected><Notification/></Protected>,
       },
       {
         path:"/search",
         element:<Protected><Search/></Protected>,
       },
       {
         path:"/explore",
         element:<Protected><Explore/></Protected>,
       }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
function App() {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      const socketio = io("https://momento-7gr6.onrender.com", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });
      

      dispatch(setSocket(socketio));

      //listening all events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      socketio.on("newMessage", (newMessage) => {
        // Only update Redux if message is from OR to the selected user
        const { selectedUser } = store.getState().auth;
        if (
          newMessage?.senderId === selectedUser?._id ||
          newMessage?.recieverId === selectedUser?._id
        ) {
          const currentMessages = store.getState().chat.messages;
          store.dispatch(setMessages([...currentMessages, newMessage]));
        }
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
