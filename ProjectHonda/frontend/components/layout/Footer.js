import React from "react";
import { useRouter } from "next/router";


export default function Footer() {
  // Hàm điều hướng
const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

    return (
        <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cột 1: Thông tin doanh nghiệp */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Công ty TNHH Phụ Tùng Honda</h3>
            <p className="text-gray-400">Chuyên cung cấp phụ tùng xe máy Honda chính hãng.</p>
            <p className="text-gray-400 mt-2">📍 Địa chỉ: 123 Đường ABC, TP.HCM</p>
            <p className="text-gray-400">📞 Hotline: 0123 456 789</p>
          </div>
  
          {/* Cột 2: Danh mục sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white">Phụ tùng</a></li>
              <li><a href="#" className="hover:text-white">Dàn điện</a></li>
              <li><a href="#" className="hover:text-white">Đèn xe</a></li>
              <li><a href="#" className="hover:text-white">Phanh & Lốp</a></li>
            </ul>
          </div>
  
          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
  
          {/* Cột 4: Mạng xã hội */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quản trị</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook-f" onClick={() => navigateTo("/admin")}>Đăng nhập quyền quản trị</i></a>
              <a href="#" className="hover:text-blue-500"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-pink-500"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-red-500"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="border-t border-gray-700 text-center mt-6 pt-4 text-gray-400">
          © 2025 Công ty TNHH Phụ Tùng Honda. All rights reserved.
        </div>
      </footer>
    );
}
