import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart } = useCart(); // Sử dụng giỏ hàng từ Context

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Giỏ hàng trống.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((product, index) => (
              <li key={index} className="border p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-700">Giá: {product.price.toLocaleString()} VND</p>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => removeFromCart(index)}
                >
                  ❌ Xóa
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Cart;
