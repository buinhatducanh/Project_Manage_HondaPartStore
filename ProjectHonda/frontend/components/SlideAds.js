import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";

export default function SlideAds() {
  // Khởi tạo mảng ảnh cố định
  const images = [
    "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739443975/Ads2_i8onsc.jpg",
    "https://res.cloudinary.com/dmz66rbbk/image/upload/v1739443975/Ads1_elln7w.jpg"
  ];

  return (
    <Swiper
      navigation
      autoplay={{ delay: 3000, disableOnInteraction: false }} // Tự động đổi ảnh sau 3 giây
      loop={true} // Lặp vô hạn
      modules={[Navigation, Autoplay]} 
      className="mySwiper w-full h-auto"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img 
            src={img} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-auto object-cover rounded-md shadow-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
