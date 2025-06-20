import { setMessages, addMessage } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import store from "@/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const {socket} = useSelector(store=>store.socketio);
  const {messages} = useSelector(store=>store.chat);

  useEffect(()=>{
    socket?.on('newMessage' , (newMessage)=>{
         dispatch(addMessage(newMessage));
    })
    return()=>{
        socket?.off('newMessage');
    }
  },[socket,dispatch])

};
export default useGetRTM;
