import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);  // ✅ Dùng state để lưu danh sách người dùng
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log(storedUser)
      setUser(storedUser);
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users");
        setUsers(data);  // ✅ Cập nhật state thay vì push
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchUsers();
  }, []);
  

  const handleLogin = (e) => {
    e.preventDefault();

    // Giả lập tài khoản admin & nhân viên
    

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); // Cập nhật state để phản ánh dữ liệu mới
      router.push(user.role === "admin" ? "/admin" : "/");
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Đăng nhập</h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
