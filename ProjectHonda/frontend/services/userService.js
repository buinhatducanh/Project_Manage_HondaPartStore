export const handleLogout = () => {
  localStorage.removeItem("user"); // Xóa user khỏi localStorage
  router.push("/login"); // Chuyển hướng về trang login
};