import axios from "axios";
import { useState, useEffect } from "react";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [editingUser, setEditingUser] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users");
            setUsers(response.data);
            console.log(users)
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (editingUser) {
                await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, form);
            } else {
                await axios.post("http://localhost:5000/api/users/register", form);
            }
            fetchData();
            setForm({ name: '', email: '', password: '', role: 'customer' });
            setEditingUser(null);
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, password: '', role: user.role });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>
            <div className="mb-6 p-4 border rounded">
                <h2 className="text-xl mb-2">{editingUser ? 'Cập nhật Người dùng' : 'Tạo Người dùng'}</h2>
                <input type="text" name="name" placeholder="Tên" value={form.name} onChange={handleChange} className="border p-2 w-full mb-2" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 w-full mb-2" />
                <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} className="border p-2 w-full mb-2" />
                <select name="role" value={form.role} onChange={handleChange} className="border p-2 w-full mb-2">
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Quản trị viên</option>
                </select>
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingUser ? 'Cập nhật' : 'Tạo'}
                </button>
            </div>

            <h2 className="text-xl mb-4">Danh sách Người dùng</h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Tên</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Vai trò</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border">
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2 flex gap-2">
                                <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded">Sửa</button>
                                <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
