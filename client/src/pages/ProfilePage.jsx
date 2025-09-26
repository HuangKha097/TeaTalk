import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setUserName(authUser.userName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu không chọn ảnh
    if (!selectedImg) {
      await updateProfile({ fullName: name, userName, bio });
      navigate("/");
      return;
    }

    // Nếu có ảnh
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg); // sẽ trả ra data:image/png;base64,...
    reader.onloadend = async () => {
      const base64Image = reader.result;

      console.log("Preview base64:", base64Image.slice(0, 50)); // ✅ kiểm tra có prefix hay không

      await updateProfile({
        profilePic: base64Image,
        fullName: name,
        userName,
        bio,
      });
      navigate("/");
    };
  };
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => {
                setSelectedImg(e.target.files[0]);
              }}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic
              }
              alt=""
              className={`w-12 h-12 rounded-full object-cover`}
            />
            upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:green-violet-500"
          />
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          />
          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-md cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10  ${selectedImg && "rounded-full"}`}
          src={authUser?.profilePic || assets.logo_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default ProfilePage;
