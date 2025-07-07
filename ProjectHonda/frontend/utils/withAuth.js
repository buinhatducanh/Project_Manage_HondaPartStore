import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Alert from "../components/Alert"; // Import Alert component

const withAuth = (WrappedComponent, allowedRoles) => {
  return (props) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null); // State lưu lỗi

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
      }
    }, []);

    useEffect(() => {
      if (user === null) {
        const timer = setTimeout(() => {
          setError("Có lỗi xảy ra khi đăng nhập. Vui lòng đăng nhập lại!");
          router.push("/login");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [user, router]);

    useEffect(() => {
      if (user && !allowedRoles.includes(user.role)) {
        router.push("/login");
      }
    }, [user, router, allowedRoles]);

    return (
      <>
        {error && <Alert type="error" message={error} />} {/* Hiển thị thông báo lỗi */}
        {user === null ?
          <p className="text-center">Đang kiểm tra quyền truy cập...</p>
          : <WrappedComponent {...props} />
        }
      </>
    );
  };
};

export default withAuth;
