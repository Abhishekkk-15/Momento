import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Notification() {
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  // const { user } = useSelector((store) => store.auth);
  return (
    <div>
      <h1 className="text-bold text-3xl text-center py-2 bg-blue-500 text-white m-1">
        Notifications
      </h1>
      <div>
        {likeNotification?.length === 0 ? (
          <p className="text-center ">No new notification</p>
        ) : (
          likeNotification?.map((notification, index) => (
            <div
              key={`${notification.userId}-${index}`}
              className="flex items-center gap-2 my-2 pl-[5%] md:pl-[12%] lg:pl-[17%] py-2 bg-amber-200"
            >
              <Link to={`/profile/${notification.userId?._id}`}>
                <Avatar>
                  <AvatarImage
                    className="h-8 w-8 rounded-full"
                    src={notification.userDetails?.profilePicture}
                  />
                  <AvatarFallback className="bg-black text-white rounded-full h-5 w-5 flex items-center justify-center p-2 text-xs font-semibold">
                    CN
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link to={`/profile/${notification.userId?._id}`}>
                <p className=" ">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  : liked your post.
                </p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default Notification;
