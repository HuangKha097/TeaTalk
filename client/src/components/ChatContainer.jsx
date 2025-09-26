import React, { useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import * as messageService from "../services/messageService";

const ChatContainer = ({
  selectedUser,
  setSelectedUser,
  showDetail,
  setShowDetail,
  media,
  setMedia,
}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState(""); // quản lý input

  const scrollEnd = useRef();

  // Auto scroll
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // Fetch messages khi chọn user
  useEffect(() => {
    if (!selectedUser?._id) return;
    const fetchMessages = async () => {
      try {
        const res = await messageService.getMessages(selectedUser._id);
        if (res.success) {
          setMessages(res.messages);
          // lọc media
          const imgs = res.messages.filter((m) => m.image).map((m) => m.image);
          setMedia(imgs);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Hàm gửi tin nhắn text
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const res = await messageService.sendMessage({
        receiverId: selectedUser._id,
        text,
      });
      if (res.success) {
        // cập nhật luôn vào UI
        setMessages((prev) => [...prev, res.newMessage]);
        setText("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Hàm convert file sang base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Khi chọn ảnh
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64Image = await fileToBase64(file);
      const msgRes = await messageService.sendMessage({
        receiverId: selectedUser._id,
        image: base64Image,
      });
      if (msgRes.success) {
        setMessages((prev) => [...prev, msgRes.newMessage]);
        setMedia((prev) => [...prev, msgRes.newMessage.image]); // thêm media
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };
  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/*---------------- header ----------------*/}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="avatar"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName || "User"}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          onClick={() => setShowDetail(!showDetail)}
          alt=""
          className="max-md:hidden max-w-5 cursor-pointer"
        />
      </div>

      {/*---------------- chat area ----------------*/}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              message.senderId !== selectedUser._id && "flex-row-reverse"
            }`}
          >
            {message.image ? (
              <img
                src={message.image}
                alt="msg-img"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-green-500/30 text-white ${
                  message.senderId === selectedUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {message.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={assets.avatar_icon}
                className="w-7 rounded-full"
                alt=""
              />
              <p className="text-gray-500">
                {formatMessageTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*---------------- bottom area ----------------*/}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Send a message"
            className="flex-1 text-sm p-2 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="gallery"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          src={assets.send_button}
          alt="send"
          className="w-12 cursor-pointer"
          onClick={handleSend}
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_big} className="max-w-35" alt="logo" />
      <p className="text-lg font-medium text-white">
        Enjoying your conversations
      </p>
    </div>
  );
};

export default ChatContainer;
