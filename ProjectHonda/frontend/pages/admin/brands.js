import axios from "axios";
import { useState, useEffect } from "react";

export default function BrandPage() {
    const [brands, setBrands] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editingBrand, setEditingBrand] = useState(null);

    const fetchBrands = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/brands");
            setBrands(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (editingBrand) {
                await axios.put(`http://localhost:5000/api/brands/${editingBrand._id}`, form);
            } else {
                await axios.post("http://localhost:5000/api/brands", form);
            }
            fetchBrands();
            setForm({ name: '', description: '' });
            setEditingBrand(null);
        } catch (error) {
            console.error("Lỗi khi lưu thương hiệu:", error);
        }
    };

    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setForm({ name: brand.name, description: brand.description });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/brands/${id}`);
            fetchBrands();
        } catch (error) {
            console.error("Lỗi khi xóa thương hiệu:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý Thương hiệu</h1>
            <div className="mb-6 p-4 border rounded">
                <h2 className="text-xl mb-2">{editingBrand ? 'Cập nhật Thương hiệu' : 'Tạo Thương hiệu'}</h2>
                <input type="text" name="name" placeholder="Tên thương hiệu" value={form.name} onChange={handleChange} className="border p-2 w-full mb-2" />
                <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} className="border p-2 w-full mb-2" />
                <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingBrand ? 'Cập nhật' : 'Tạo'}
                </button>
            </div>

            <h2 className="text-xl mb-4">Danh sách Thương hiệu</h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Tên</th>
                        <th className="border p-2">Mô tả</th>
                        <th className="border p-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand._id} className="border">
                            <td className="border p-2">{brand.name}</td>
                            <td className="border p-2">{brand.description}</td>
                            <td className="border p-2 flex gap-2">
                                <button onClick={() => handleEdit(brand)} className="bg-yellow-500 text-white px-2 py-1 rounded">Sửa</button>
                                <button onClick={() => handleDelete(brand._id)} className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
