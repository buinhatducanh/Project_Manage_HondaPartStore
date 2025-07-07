/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";

export default function ProductItem({
  name,
  price,
  description,
  image,
  quantity,
}) {
  const [isValid, setValid] = useState(true);
  const [currentImage, setCurrentImage] = useState(image?.[0] || "");
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!name || !price || !image || image.length === 0) {
      setValid(false);
    }
  }, [name, price, image]);

  const handleMouseEnter = () => {
    if (image.length > 1) {
      setImageIndex((prevIndex) => (prevIndex + 1) % image.length);
      setCurrentImage(image[(imageIndex + 1) % image.length]);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(image[0]);
    setImageIndex(0);
  };

  return isValid ? (
    <div
      className="w-72 border p-1 rounded-2xl shadow-lg hover:shadow-xl transition-transform bg-neutral-800 backdrop-blur-md text-white snap-start hover:scale-105 duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full h-[18rem] aspect-[3/2] overflow-hidden rounded-lg">
        <img
          src={
            currentImage ||
            "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739377337/empty_cpvono.jpg"
          }
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) =>
            (e.target.src =
              "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739377337/empty_cpvono.jpg")
          }
        />
      </div>

      <div className=" p-2 mt-5">
        <h2 className="text-lg font-semibold text-white drop-shadow-md">
          {name}
        </h2>
        <div className="flex justify-between">
          <p className="text-xl text-yellow-400 font-bold drop-shadow-md">
            {Number(price).toLocaleString()}đ
          </p>
          <p className="flex items-center gap-2 text-green-300">
            <FaBoxOpen className="text-green-400" />
            {quantity > 0 ? "Còn hàng" : "Hết hàng"}
          </p>
        </div>

        <p className="text-gray-300 text-sm line-clamp-2">
          {description || "Không có mô tả sản phẩm"}
        </p>
      </div>
    </div>
  ) : (
    <div className="text-red-500 p-4 bg-red-100 rounded-lg shadow-md">
      Sản phẩm không hợp lệ hoặc thiếu thông tin.
    </div>
  );
}
