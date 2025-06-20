// import { setUserProfile } from "@/redux/authSlice";
// import { setPosts } from "@/redux/postSlice";
// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// const useGetUserProfile = (userId) => {
//   const dispatch = useDispatch();
   
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8080/api/v1/user/${userId}/profile`, {
//           withCredentials: true,
//         });
//         if (res.data.success) {
//           dispatch(setUserProfile(res.data.user));
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchUserProfile();
//   }, [userId]);
// };
// export default useGetUserProfile;
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/user/${userId}/profile`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
      }
    } catch (error) {
      console.log(error);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);

  return fetchUserProfile; // ⬅ Return it so you can manually re-fetch
};

export default useGetUserProfile;
