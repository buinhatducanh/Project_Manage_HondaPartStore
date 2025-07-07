import { useState } from "react";
import axios from "axios";

const ImageUpload = ({ productId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  // Xử lý khi chọn nhiều file
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  // Gửi file lên server
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("images", file);
    }

    try {
      // Gửi ảnh lên Cloudinary
      const uploadRes = await axios.post("http://localhost:5000/api/upload-multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageIds = uploadRes.data.imageIds; // Lấy ID ảnh

      // Gửi danh sách ID ảnh vào sản phẩm
      await axios.post(`http://localhost:5000/api/product/${productId}/add-images`, { imageIds });

      setImageUrls([...imageUrls, ...imageIds]);
      alert("Upload thành công!");
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Upload thất bại!");
    }
  };

  return (
    <div>
      <h2>Upload Ảnh Sản Phẩm</h2>
      <input type="file" multiple onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Tải lên</button>

      <div>
        <h3>Ảnh đã tải lên:</h3>
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: "100px", margin: "5px" }} />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
