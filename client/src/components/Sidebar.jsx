import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getUsersForSidebar } from "../services/messageService";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [unseenMessage, setUnseenMessage] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsersForSidebar();
      if (data.success) {
        setUsers(data.users);
        setUnseenMessage(data.unseenMessage);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div
      className={`bg-gray-900 h-full p-5 rounded-r-xl overflow-y-scroll text-gray-200 ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* -------- Header -------- */}
      <div className="flex flex-col gap-5 pb-5">
        <div className="flex justify-between items-center">
          {/* Logo giữ màu xanh */}
          <h1 className="text-green-500 font-bold text-lg">TeaTalk</h1>

          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer "
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-gray-800 border border-gray-700 text-gray-200 shadow hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-green-400"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-700" />
              <p
                onClick={logout}
                className="cursor-pointer text-sm hover:text-green-400"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* -------- Search box -------- */}
        <div className="bg-gray-800 rounded-full flex items-center gap-2 py-3 px-4">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-3 invert opacity-70"
          />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-gray-200 text-xs placeholder-gray-400 flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* -------- User list -------- */}
      <div className="flex flex-col">
        {users.map((user) => (
          <div
            onClick={() => setSelectedUser(user)}
            key={user._id}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm transition ${
              selectedUser?._id === user._id
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-[35px] h-[35px] object-cover rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="font-medium">{user.fullName}</p>
              <span className="text-gray-400 text-xs">Offline</span>
            </div>

            {/* Badge tin chưa đọc */}
            {unseenMessage[user._id] && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-green-600 text-white">
                {unseenMessage[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
