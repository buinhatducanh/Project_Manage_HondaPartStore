// pages/_app.js
import { useState, useEffect } from "react";
import "../styles/globals.css";
import { CartProvider } from "../context/CartContext";
import Layout from "../components/layout/Layout";
import AdminLayout from "../components/admin/AdminLayout";
import { useSidebarStore } from "../store/sidebarStore";
import { throttle } from "lodash";

function MyApp({ Component, pageProps, router }) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const isAdminRoute = router.pathname.startsWith("/admin");
  const contentMargin = isCollapsed ? "ml-[3%]" : "ml-[13%]";
  const sidebarWidth = isCollapsed ? "left-[6%]" : "left-[16%]";
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

 
  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsVisible(window.scrollY <= lastScrollY || window.scrollY <= 30);
      setLastScrollY(window.scrollY);
    }, 200); // Giới hạn 1 lần cập nhật mỗi 200ms

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <CartProvider>
      {isAdminRoute ? (
        <AdminLayout>
          <div className={`${contentMargin} duration-300 ease-in-out`}>
            {/* Navbar */}
            <nav
              className={`fixed top-0 ${sidebarWidth} w-full bg-gray-800 text-white p-4 flex justify-between items-center shadow-md transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
              style={{ willChange: "transform" }}
            >
              <h1 className="text-xl font-bold">Trang quản trị</h1>
            </nav>
            <div className="mt-5"> <Component {...pageProps} /></div>
          </div>

        </AdminLayout>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </CartProvider>
  );
}

export default MyApp;
