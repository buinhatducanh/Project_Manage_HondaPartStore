import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  renderCategories,
  handleCategoryChange,
} from "../../services/categoryService";
import ProductFormSidebar from "../ProductFormSidebar";
import LoadingScreen from "../LoadingScreen";

const API_URL = "http://localhost:5000/api";
const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739377337/empty_cpvono.jpg";

const AdminProducts = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    brand: "",
    categories: [],
    price: 0,
    quantity: 0,
    description: "",
    // Lưu ảnh ở đây có thể là mảng File (ảnh mới) hoặc đối tượng đã lưu với {url, public_id}
    image: [],
    additionalInfo: {
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dùng useMemo để tính brandMap chỉ khi brands thay đổi (nếu cần sử dụng)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const brandMap = useMemo(() => {
    return brands.reduce((acc, brand) => {
      acc[brand._id] = brand.name;
      return acc;
    }, {});
  }, [brands]);

  const fetchData = useCallback(async () => {
    try {
      const [productRes, brandRes, categoryRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/brands`),
        axios.get(`${API_URL}/categories`),
      ]);

      setProducts(productRes.data);
      setBrands(brandRes.data || []);
      setCategories(categoryRes.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  }, []);

  useEffect(() => {
    toast.success("Chào mừng đến trang quản lý sản phẩm!");
    fetchData();
  }, [fetchData]);

  // Xử lý lọc sản phẩm với useMemo để giảm tính toán lại
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // Lưu ý: nếu product.brand là đối tượng, ta có thể so sánh _id
      const matchBrand = filterBrand
        ? product.brand && product.brand._id === filterBrand
        : true;
      const matchMinPrice = minPrice ? product.price >= Number(minPrice) : true;
      const matchMaxPrice = maxPrice ? product.price <= Number(maxPrice) : true;
      return matchSearch && matchBrand && matchMinPrice && matchMaxPrice;
    });
  }, [products, searchTerm, filterBrand, minPrice, maxPrice]);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Nếu không có hãng, tìm hãng Honda trong danh sách brands
    const defaultBrandId =
      brands.find((b) => b.name.toLowerCase() === "honda")?._id || "";
    const brandToSubmit = formData.brand || defaultBrandId;

    // Tạo một bản sao của formData với giá trị brand cập nhật
    const dataToSubmit = { ...formData, brand: brandToSubmit };

    // Tạo FormData, xử lý ảnh mới và giữ ảnh cũ
    const formDataWithImage = new FormData();
    Object.keys(dataToSubmit).forEach((key) => {
      if (key === "image" && dataToSubmit.image?.length > 0) {
        dataToSubmit.image.forEach((img) => {
          if (img instanceof File) {
            formDataWithImage.append("image", img);
          } else {
            // Đối với ảnh đã lưu (đối tượng có url, public_id), ta gửi dưới dạng JSON
            formDataWithImage.append("existingImages", JSON.stringify(img));
          }
        });
      } else if (typeof dataToSubmit[key] === "object") {
        formDataWithImage.append(key, JSON.stringify(dataToSubmit[key]));
      } else {
        formDataWithImage.append(key, dataToSubmit[key]);
      }
    });

    try {
      if (editingProduct) {
        await axios.put(
          `${API_URL}/products/${editingProduct._id}`,
          formDataWithImage,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(`${API_URL}/products`, formDataWithImage, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Thêm sản phẩm thành công!");
      }
      fetchData();
    } catch (error) {
      console.error("❌ Lỗi khi gửi dữ liệu", error.response?.data || error.message);
      toast.error("Có lỗi xảy ra khi gửi dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const response = await axios.delete(`${API_URL}/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
      toast.success(response.data.message || "Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm", error.response?.data || error.message);
      toast.error(
        error.response?.data.message || "Không thể xóa sản phẩm!"
      );
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    // Tạo preview từ File object
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      // Thêm các File mới vào mảng image
      image: prev.image ? [...prev.image, ...files] : [...files],
    }));
    setImagePreview((prev) => [...prev, ...imageUrls]);
  };

  const handleEdit = (product) => {
    toast.success("Sửa sản phẩm: " + product.name);
    // Lấy ra danh sách URL từ đối tượng ảnh (nếu có)
    const filteredImages =
      product.image && product.image.length > 0
        ? product.image.filter((img) => img.url !== DEFAULT_IMAGE_URL)
        : [];
    const previewUrls =
      filteredImages.length > 0
        ? filteredImages.map((img) => img.url)
        : [DEFAULT_IMAGE_URL];

    setImagePreview(previewUrls);

    setFormData({
      code: product.code || "",
      name: product.name || "",
      // Nếu brand là object thì lấy _id, nếu không thì dùng trực tiếp
      brand: product.brand ? (product.brand._id || product.brand) : "",
      categories: product.categories?.map((cat) => cat._id) || [],
      price: product.price || 0,
      quantity: product.quantity || 0,
      description: product.description || "",
      // Lưu toàn bộ đối tượng ảnh
      image: product.image && product.image.length > 0 ? product.image : [{ url: DEFAULT_IMAGE_URL, public_id: "default" }],
      additionalInfo: {
        weight: product.additionalInfo?.weight || 0,
        length: product.additionalInfo?.length || 0,
        width: product.additionalInfo?.width || 0,
        height: product.additionalInfo?.height || 0,
      },
    });

    setIsSidebarOpen(true);
    setEditingProduct(product);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, price: Number(value) }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = useCallback(() => {
    setFormData({
      code: "",
      name: "",
      brand: "",
      categories: [],
      price: 0,
      quantity: 0,
      description: "",
      image: [],
      additionalInfo: {
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
      },
    });
    setEditingProduct(null);
    setImagePreview([]);
  }, []);

  const handleAdditionalInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [field]: Number(value) || 0,
      },
    }));
  };

  const handleCreate = () => {
    handleClear();
    handleOpenSidebar();
  };

  return (
    <div className="grid">
      <div className="container p-6 overscroll-contain col-span-3">
        <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="border p-2 rounded w-1/3"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Giá tối thiểu"
            className="border p-2 rounded w-1/6"
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Giá tối đa"
            className="border p-2 rounded w-1/6"
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Thêm sản phẩm
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded shadow-lg p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="border p-2 w-40 h-20">Hình ảnh</th>
                <th className="border p-2">Mã sản phẩm</th>
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Giá</th>
                <th className="border p-2">Trạng thái</th>
                <th className="border p-2">Hãng</th>
                <th className="border p-2">Kho hàng</th>
                <th className="border p-2">Danh mục</th>
                <th className="border p-2">Thông tin thêm</th>
                <th className="border p-2 w-40">Mô tả</th>
                <th className="border p-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="border p-2">
                    <div className="flex space-x-2 overflow-x-auto">
                      {product.image.map((img, index) => (
                        <img
                          key={index}
                          // Dùng thuộc tính url từ đối tượng ảnh, nếu không có thì dùng default
                          src={img.url || DEFAULT_IMAGE_URL}
                          alt={product.name}
                          className="object-cover h-20 w-20"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="border p-2">{product.code}</td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">
                    {formatPrice(product.price)} VNĐ
                  </td>
                  <td className="border p-2">
                    {product.quantity > 0 ? (
                      <span className="text-green-500">Còn hàng</span>
                    ) : (
                      <span className="text-red-500">Hết hàng</span>
                    )}
                  </td>
                  <td className="border p-2">
                    {product.brand ? product.brand.name : "Không có hãng"}
                  </td>
                  <td className="border p-2">{product.quantity}</td>
                  <td className="border p-2">
                    {product.categories.length > 0
                      ? product.categories.map((cat) => cat.name).join(", ")
                      : "Không có danh mục"}
                  </td>
                  <td className="border p-2">
                    {product.additionalInfo &&
                    typeof product.additionalInfo === "object"
                      ? `Trọng lượng: ${product.additionalInfo.weight || 0}kg, Kích thước: ${product.additionalInfo.length || 0}x${product.additionalInfo.width || 0}x${product.additionalInfo.height || 0} cm`
                      : "Không có thông tin thêm"}
                  </td>
                  <td className="border p-2 whitespace-pre-line">
                    {product.description}
                  </td>
                  <td className="border p-2 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-sky-500 px-3 py-1 rounded"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 px-3 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleClear={handleClear}
        handlePriceChange={handlePriceChange}
        renderCategories={renderCategories}
        categories={categories}
        handleCategoryChange={handleCategoryChange}
        brands={brands}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        handleRemoveImage={handleRemoveImage}
        handleAdditionalInfoChange={handleAdditionalInfoChange}
        editingProduct={editingProduct}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <LoadingScreen loading={loading} />
    </div>
  );
};

export default AdminProducts;
