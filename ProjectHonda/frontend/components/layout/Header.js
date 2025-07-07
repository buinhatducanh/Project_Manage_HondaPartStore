import React, { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Root from "../Root";
import axios from "axios";
import { SiHonda } from "react-icons/si";
import { IoMenuSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isHomePage, setIsHomePage] = useState(false);
    const [brands, setBrands] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                // Nếu không có dữ liệu hợp lệ, gọi API
                const { data } = await axios.get("http://localhost:5000/api/brands");
                console.log("Dữ liệu brands lấy từ API");
                if (Array.isArray(data)) {
                    setBrands(data);
                } else {
                    console.error("Dữ liệu từ API không phải là mảng!", data);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách thương hiệu", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        // Kiểm tra nếu đang ở trang chủ
        setIsHomePage(router.pathname === "/");
    }, [router.pathname]);

    useEffect(() => {
        // Mở dropdown nếu đang ở trang chủ
        if (isHomePage) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [isHomePage]); // Chạy lại khi isHomePage thay đổi

    useEffect(() => {
        console.log(isHomePage); // Kiểm tra isHomePage mỗi khi nó thay đổi
    }, [isHomePage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <header className="w-full text-white bg-cover bg-center relative"
            style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://res.cloudinary.com/dmz66rbbk/image/upload/v1740398668/headerMoto_i7iap1.png')" }}>
            <div className="max-w-[90%] pt-3 mx-auto">
                <div className="relative py-4 flex items-center justify-between">
                    <div className="text-xl font-bold">
                        <img src="/images/logo.svg" alt="Logo" />
                    </div>

                    <div className="relative w-2/5">
                        <input
                            type="text"
                            placeholder="Nhập tên phụ tùng hoặc mã phụ tùng"
                            className="w-full px-4 py-2 pr-12 rounded-md text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button className="absolute inset-y-0 right-0 px-4 flex items-center justify-center bg-red-600 text-white rounded-r-md hover:bg-red-700 transition">
                            <FaSearch className="text-lg" />
                        </button>
                    </div>

                    <div className="font-bold flex items-center px-4">
                        <FaPhoneAlt className="mr-3 text-3xl" />
                        <div>
                            <p className="text-sm">Hotline hỗ trợ:</p>
                            <p className="text-xl">0378 443 602</p>
                        </div>
                    </div>
                </div>

                {isHomePage && <Root />}

                <nav className="relative text-white pb-1 mt-1">
                    <ul className="flex justify-between bg-transparent px-auto rounded-md">
                        <li
                            className="relative bg-red-700 px-3 py-4 cursor-pointer"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <span className="text-white flex justify-between px-2" onClick={() => router.push('/vehicle_manufacturer')}>
                                <IoMenuSharp className="text-2xl" />
                                <p className="ml-[4rem] font-bold">PHỤ TÙNG THEO XE</p>
                            </span>
                            {isDropdownOpen && (
                                <ul
                                    className="ux-nav-vertical-menu nav-vertical-fly-out absolute left-0 top-full w-72 text-white bg-stone-800 shadow-lg z-50 rounded-lg max-h-[65vh] overflow-y-auto"
                                >
                                    {brands.map((brand) => (
                                        <li
                                            key={brand._id}
                                            className="flex justify-between items-center px-5 py-2 hover:bg-gray-200 cursor-pointer min-h-[8vh]"
                                            onClick={() => router.push(`/brand/${brand.name}`)}
                                        >
                                            <SiHonda />
                                            <div className="text-end">{brand.name}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        {[{ label: "Trang chủ", path: "/" },
                        { label: "Phụ tùng", path: "/spare_parts" },
                        { label: "Phụ kiện", path: "/accessories" },
                        { label: "Dầu nhớt", path: "/lubricating_oil" },
                        { label: "Dịch vụ", path: "/service" },
                        { label: "Khuyến mãi", path: "/promotion" },
                        { label: "Liên hệ", path: "/contact" },
                        ].map((menuItem, index) => (
                            <li
                                key={index}
                                className="cursor-pointer font-bold uppercase px-4 py-2 rounded-md transition-all duration-300 hover:bg-red-600 hover:text-white"
                                onClick={() => router.push(menuItem.path)}
                            >
                                {menuItem.label}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
