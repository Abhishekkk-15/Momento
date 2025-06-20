 import { Conversation } from "../models/Conversation.model.js";
 import { Message } from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

// //for chat
 export const sendMessage = async (req, res) => {
   try {
     const senderId = req.id;
     const recieverId = req.params.id;
     const {textMessage :message } = req.body;
     console.log(message);

     const conversation = await Conversation.findOne({
       participants: { $all: [senderId, recieverId] },
     }).populate('messages');
     //establishing the conversation if not started yet.

     if (!conversation) {
       conversation = await Conversation.create({
         participants: [senderId, recieverId],
       });
     }
     const newMessage = await Message.create({
       senderId,
       recieverId,
       message,
     });
     if (newMessage) conversation.messages.push(newMessage._id);
     await Promise.all([conversation.save(), newMessage.save()]);

     //implemengt socket io for real time data transfer
      const recieverSocketId = getRecieverSocketId(recieverId);
      if(recieverSocketId){
        io.to(recieverSocketId).emit('newMessage', newMessage);
      }
     return res.status(201).json({
         success:true,
         newMessage
     })
   } catch (error) {
     console.log(error);
   }
 };

 //get message
 export const getMessage = async(req,res)=>{
     try {
         const senderId=req.id;
         const recieverId = req.params.id;
         const conversation = await Conversation.find({
             participants:{$all:[senderId,recieverId]}
         });
         if(!conversation) return res.status(200).json({success:true,message:[]});

         return res.status(200).json({success:true,messages:conversation?.messages});
     } catch (error) {
         console.log(error)
     }
 }
