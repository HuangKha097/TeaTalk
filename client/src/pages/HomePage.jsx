import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(false);
  const [showDetailChat, setShowDetailChat] = useState(false);
  const [media, setMedia] = useState([]);
  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser && showDetailChat ? "md:grid-cols-[1fr_1.5gr_1fr] xl:grid-cols-[1fr_2fr_1fr]" : "md:grid-cols-[1fr_2.5fr]"}`}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          showDetail={showDetailChat}
          setShowDetail={setShowDetailChat}
          media={media}
          setMedia={setMedia}
        />
        <RightSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          showDetail={showDetailChat}
          media={media}
          setMedia={setMedia}
        />
      </div>
    </div>
  );
};

export default HomePage;
