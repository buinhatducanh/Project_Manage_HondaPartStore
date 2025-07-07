import { useState, useEffect } from "react";
import { Button, Input, Card, CardContent } from "../ui";
import axios from "axios";
import {getAllChildIds } from "../../services/categoryService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillDelete } from "react-icons/ai";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", parent: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [setFormData] = useState({ categories: [] });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:5000/api/categories/${editingCategory._id}`, form);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post("http://localhost:5000/api/categories", form);
        toast.success("Thêm mới danh mục thành công!");
      }
      setForm({ name: "", parent: null });
      setEditingCategory(null);
      
      fetchCategories();
    } catch (error) {
      toast.error("Thêm/Sửa danh mục thất bại!");
      console.error("Failed to save category:", error);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name, parent: category.parent });
    setEditingCategory(category);
    setFormData({ categories: [category._id, ...getAllChildIds(categories, category._id)] });
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn chắc chắn muốn xoá danh mục này chứ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        toast.success("Xoá danh mục thành công!");
        fetchCategories();
      } catch (error) {
        toast.error("Xoá danh mục thất bại!");
        console.error("Failed to delete category:", error);
      }
    }
  };

  return (
    <div className="p-6 grid grid-cols-2">
      <div className="m-5">
        <h1 className="text-2xl mb-4">Quản lí danh mục phụ tùng</h1>
        <Card hoverScale={100}>
          <CardContent>
            <Input
              placeholder="Tên phân loại"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              value={form.parent || ""}
              onChange={(e) => setForm({ ...form, parent: e.target.value })}
              className="ml-2 mt-3 p-2 w-full border rounded"
            >
              <option value="">Không có danh mục cha</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <Button onClick={handleSubmit} className="ml-2 mt-3 bg-neutral-700 hover:bg-neutral-950">
              {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="m-5">
        {categories.map((category) => (
          <Card key={category._id} event={() => handleEdit(category)} hoverScale={105}> 
            <CardContent>   
              <div className="flex justify-between items-center">
                <div>
                  <p>{category.name}</p>
                  {category.parent && (
                    <p className="text-sm text-gray-500">
                      Danh mục cha: {categories.find((c) => c._id === category.parent)?.name || "Không có"}
                    </p>
                  )}
                </div>
                <div>
                  <button onClick={() => handleDelete(category._id)} variant="destructive" className="bg-white-700 p-5">
                    <AiFillDelete className="text-red-700"/>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
