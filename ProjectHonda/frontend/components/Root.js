import { useRouter } from "next/router";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { useState } from "react";

export default function Root() {
    const router = useRouter();
    const pathSegments = router.pathname.split("/").filter((seg) => seg);

    // Bảng ánh xạ slug -> Tiếng Việt
    const breadcrumbMap = {
        "spare_parts": "Phụ tùng",
        "accessories": "Phụ kiện",
        "lubricating_oil": "Dầu nhớt",
        "service": "Dịch vụ",
        "promotion": "Khuyến mãi",
        "contact": "Liên hệ",
    };

    return (
        
        <nav className="text-gray-600 text-sm py-2 px-4">
            <ol className="flex space-x-2 text-xl">
                {/* Link về Trang chủ */}
                <li>
                    <Link href="/" className="flex text-blue-500 hover:underline">
                        Trang chủ <FaHome className="ml-3 text-2xl" />
                    </Link>
                </li>

                {/* Hiển thị Breadcrumbs */}
                {pathSegments.map((segment, index) => {
                    const path = "/" + pathSegments.slice(0, index + 1).join("/");
                    const displayName = breadcrumbMap[segment] || decodeURIComponent(segment); // Dùng ánh xạ hoặc slug mặc định
                    return (
                        <li key={index} className="flex items-center">
                            <span className="mx-2">/</span>
                            <Link href={path} className="text-blue-500 hover:underline capitalize">
                                {displayName}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
