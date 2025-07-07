
export const getAllChildIds = (categories, parentId) => {
    const childIds = categories
        .filter((category) => category.parent === parentId)
        .flatMap((category) => [category._id, ...getAllChildIds(categories, category._id)]);

    return childIds;
};

// Hàm xử lý chọn/bỏ chọn
export const handleCategoryChange = (categoryId, categories, formData, setFormData) => {
    setFormData((prevData) => {
        const isSelected = prevData.categories.includes(categoryId);
        const childIds = getAllChildIds(categories, categoryId);

        let updatedCategories;

        if (isSelected) {
            // Nếu đã chọn => bỏ chọn cha và con
            updatedCategories = prevData.categories.filter((id) => id !== categoryId && !childIds.includes(id));
        } else {
            // Nếu chưa chọn => chọn cha và con
            updatedCategories = [...prevData.categories, categoryId, ...childIds];
        }

        return { ...prevData, categories: [...new Set(updatedCategories)] }; // Dùng Set để loại trùng
    });
};

// Đệ quy render cây danh mục
export const renderCategories = (categories, parent = null, formData, handleCategoryChange) => {
    return categories
        .filter((category) => category.parent === parent)
        .map((category) => (
            <div key={category._id} className="ml-3">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        value={category._id}
                        checked={formData.categories.includes(category._id)}
                        onChange={() => handleCategoryChange(category._id)}
                    />
                    <span>{category.name}</span>
                </label>
                {renderCategories(categories, category._id, formData, handleCategoryChange)}
            </div>
        ));
};
