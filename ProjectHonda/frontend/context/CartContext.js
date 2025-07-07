import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🔹 Load giỏ hàng từ localStorage khi mở lại trang
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 🔹 Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prev) => {
      const updatedCart = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu vào localStorage
      return updatedCart;
    });
  };

  // 🔹 Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (index) => {
    setCart((prev) => {
      const updatedCart = prev.filter((_, i) => i !== index);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Cập nhật localStorage
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Tạo hook để dễ dàng sử dụng Context trong các component khác
export const useCart = () => useContext(CartContext);
