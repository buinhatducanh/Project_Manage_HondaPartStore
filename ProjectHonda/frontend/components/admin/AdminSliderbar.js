import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    FaTachometerAlt, FaBoxOpen, FaUserCog,
    FaSignOutAlt, FaClipboardList,FaMotorcycle, FaTools, FaUsers
} from "react-icons/fa";
import { IoMenuSharp } from "react-icons/io5";
import { useSidebarStore } from "../../store/sidebarStore";

export default function AdminSidebar() {
    const { isCollapsed, toggleSidebar } = useSidebarStore();
    const router = useRouter();

    const [adminName, setAdminName] = useState("");

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setAdminName(JSON.parse(user)?.name || "Admin");
        }
    }, []);

    const adminMenuItems = [
        { label: "Dashboard", icon: <FaTachometerAlt />, path: "/admin" },
        { label: "Sản phẩm", icon: <FaBoxOpen />, path: "/admin/products" },
        { label: "Danh mục", icon: <FaClipboardList />, path: "/admin/categories" },
        { label: "Người dùng", icon: <FaUsers />, path: "/admin/users" },
        { label: "Hiệu xe", icon: <FaMotorcycle />, path: "/admin/brands" },
        { label: "Dịch vụ", icon: <FaTools />, path: "/admin/services" },
        { label: "Cài đặt", icon: <FaUserCog />, path: "/admin/settings" },
    ];

    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 flex flex-col ${isCollapsed ? "w-[5%]" : "w-[15%]"} transition-all duration-300`}
        >
            <div className="flex items-center justify-between mb-6">
                <h1 className={`text-xl font-bold ${isCollapsed ? "hidden" : "block"}`}>
                    Quản trị viên: {adminName}
                </h1>
                <IoMenuSharp
                    className="text-2xl cursor-pointer"
                    onClick={toggleSidebar}
                />
            </div>

            <ul className="space-y-4 flex-1">
                {adminMenuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-red-600 transition ${router.pathname === item.path ? "bg-red-700" : ""}`}
                        onClick={() => {
                            if (router.pathname !== item.path) {
                                router.push(item.path);
                            }
                        }}                        
                    >
                        <span className="text-xl mr-3">{item.icon}</span>
                        {!isCollapsed && <span>{item.label}</span>}
                    </li>
                ))}
            </ul>

            <div className="absolute bottom-4 right-4 left-4">
                <button
                    className="flex items-center justify-center w-full p-2 bg-red-500 hover:bg-red-700 rounded-md"
                    onClick={() => router.push("/logout")}
                >
                    <FaSignOutAlt className="text-xl" />
                    {!isCollapsed && <span className="ml-2">Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
}
