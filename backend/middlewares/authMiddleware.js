import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// export const protect = async (req, res, next) => {

// //   let token;
// //   if (
// //     req.headers.authorization &&
// //     req.headers.authorization.startsWith('Bearer')
// //   ) {
// //     try {
// //       token = req.headers.authorization.split(' ')[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = await User.findById(decoded.id).select('-password');
// //       next();
// //     } catch (error) {
// //       res.status(401).json({ message: 'Not authorized' });
// //     }
// //   } else {
// //     res.status(401).json({ message: 'No token provided' });
// //   }
// // }
//    try {
//       const token = req.cookies.token;
//       if (!token) {
//           return res.status(401).json({
//               message:'User not authenticated.',
//               success:false
//           });
//       }
//       const decode =  jwt.verify(token,process.env.SECRET_KEY);
//       if (!decode) {
//           return res.status(401).json({
//               message:'Invalid.',
//               success:false
//           });
//       }
//       req.id = decode.userId;
//       next();
//     } catch (error) {
//       console.log(error);
//     }
// };
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("Incoming Auth Header:", req.headers.authorization);
    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   req.user = await User.findById(decoded.id).select("-password");

    //   console.log("Incoming Auth Header:", req.headers.authorization);
    //   console.log("Decoded ID:", decoded.id);

    //   req.user = await User.findById(decoded.id).select("-password");

    //   next();
    // }
    try {
      // ✅ Extract the token
      token = req.headers.authorization.split(" ")[1];
      console.log("Incoming Auth Header:", req.headers.authorization);

      // ✅ Verify
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Decoded Token:", decoded);

      req.user = await User.findById(decoded.userId).select("-password");

      // ✅ Attach user
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        console.log("❌ User not found for ID:", decoded.userId);
        return res
          .status(401)
          .json({ message: "User not found, token invalid" });
      }

      req.user = user;
      console.log("🔥 Final User from token:", req.user);

      next();
    } catch (err) {
      
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
