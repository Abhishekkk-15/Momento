// export default CreatePost;
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { DialogHeader } from "./dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataURL(selectedFile);
      setPreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file); // image = field name expected by backend

    try {
      setLoading(true);
      const res = await axios.post(
        "https://momento-7gr6.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption("");
        setFile("");
        setPreview("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 md:p-6 rounded-xl shadow-xl w-[90vw] max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="flex items-center font-semibold text-lg md:text-xl mb-4">
          Create New Post
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage
              className="h-8 w-8 rounded-full"
              src={user?.profilePicture}
              alt="Profile"
            />
            <AvatarFallback className="bg-black text-white rounded-full h-10 w-10 flex items-center p-2">
              {user?.username?.slice(0, 2).toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm md:text-base">
              {user?.username}
            </h1>
            <span className="text-gray-600 text-xs md:text-sm">
              Bio here...
            </span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none border-black mb-4"
          placeholder="Write a caption..."
        />

        {preview && (
          <div className="w-full h-64 overflow-hidden rounded-md mb-4 flex justify-center items-center bg-gray-100">
            {file?.type?.startsWith("video/") ? (
              <video controls className="object-contain max-h-full w-full">
                <source src={preview} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="object-contain max-h-full"
              />
            )}
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          accept="image/*, video/*"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => imageRef.current.click()}
          className="block mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from Computer
        </Button>

        {preview &&
          (loading ? (
            <Button className="mx-auto w-full my-3 bg-[#0095F6] hover:bg-[#258bcf]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="mx-auto w-full my-3 bg-[#0095F6] hover:bg-[#258bcf]"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
