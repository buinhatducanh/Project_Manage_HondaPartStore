import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductFormSidebar = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  handleClear,
  handlePriceChange,
  renderCategories,
  categories,
  handleCategoryChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  brands,
  imagePreview,
  handleImageChange,
  handleRemoveImage,
  handleAdditionalInfoChange,
  editingProduct,
}) => {
  const fileInputRef = useRef(null);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 right-0 w-1/3 h-full bg-white p-6 shadow-lg z-50 overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500"
          >
            ✖
          </button>
          <h2 className="text-lg font-bold mb-4">
            {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mã sản phẩm */}
            <label className="block">
              Mã sản phẩm:
              <input
                type="text"
                placeholder="Nhập mã sản phẩm"
                className="w-full p-2 border rounded"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </label>

            {/* Tên sản phẩm */}
            <label className="block">
              Tên sản phẩm:
              <input
                type="text"
                placeholder="Tên sản phẩm"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </label>

            {/* Giá sản phẩm */}
            <label className="block">
              Giá sản phẩm:
              <input
                type="text"
                placeholder="Nhập giá..."
                className="w-full p-2 border rounded"
                value={formData.price}
                onChange={handlePriceChange}
              />
            </label>

            {/* Danh mục sản phẩm */}
            <div>
              <p className="font-semibold">Chọn danh mục:</p>
              {renderCategories(categories, null, formData, (categoryId) =>
                handleCategoryChange(
                  categoryId,
                  categories,
                  formData,
                  setFormData
                )
              )}
            </div>

            {/* Hình ảnh sản phẩm */}
            <div className="block">
              <p className="font-semibold mb-2">Hình ảnh sản phẩm:</p>

              {/* Input file ẩn */}
              <input
                type="file"
                name="image"
                multiple
                onChange={handleImageChange}
                ref={fileInputRef}
                className="hidden"
              />

              {/* Hiển thị danh sách ảnh */}
              <div className="flex flex-wrap mt-2">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      className="h-20 w-20 object-cover m-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              {/* Nút bấm mở input file */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()} // Mở input file khi nhấn
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-900 transition"
              >
                + Thêm ảnh mới
              </button>
            </div>
            {/* Số lượng sản phẩm */}
            <label className="block">
              Số lượng:
              <input
                type="number"
                placeholder="Nhập số lượng"
                className="w-full p-2 border rounded"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                required
              />
            </label>
            {/* Mô tả sản phẩm */}
            <label className="block">
              Mô tả sản phẩm:
              <textarea
                placeholder="Nhập mô tả sản phẩm..."
                className="w-full p-2 border rounded"
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </label>

            {/* Thông tin bổ sung */}
            <fieldset className="p-4 border rounded">
              <legend className="font-semibold">Thông tin bổ sung</legend>
              <div className="grid grid-cols-1 gap-4">
                {["weight", "length", "width", "height"].map((field) => (
                  <div key={field}>
                    <p>{field.charAt(0).toUpperCase() + field.slice(1)}:</p>
                    <input
                      type="number"
                      placeholder={field}
                      className="p-2 border rounded w-full"
                      value={formData.additionalInfo[field] || 0}
                      onChange={(e) =>
                        handleAdditionalInfoChange(field, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Nút thao tác */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editingProduct ? "Cập nhật" : "Thêm"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Làm trống form
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormSidebar;
