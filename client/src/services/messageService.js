import axios from "axios";

// Lấy danh sách user + số tin nhắn chưa đọc cho sidebar
export const getUsersForSidebar = async () => {
  try {
    const res = await axios.get("/api/messages/users", {
      withCredentials: true,
    });
    return res.data; // { success, users, unseenMessage }
  } catch (error) {
    console.error("Error fetching sidebar users:", error);
    return { success: false, message: error.message };
  }
};

// Lấy toàn bộ tin nhắn với user được chọn
export const getMessages = async (id) => {
  try {
    const res = await axios.get(`/api/messages/${id}`, {
      withCredentials: true,
    });
    return res.data; // { success, messages }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, message: error.message };
  }
};

// Gửi tin nhắn mới
export const sendMessage = async ({ receiverId, text, image }) => {
  try {
    const res = await axios.post(
      `/api/messages/send/${receiverId}`, // gửi kèm id trên URL
      { text, image }, // body chỉ cần text hoặc image
      { withCredentials: true }
    );
    return res.data; // { success, newMessage }
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, message: error.message };
  }
};
