import { useRouter } from "next/router";

const useNavigation = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.role === "admin") {
      router.push(path);
    } else {
      router.push("/login"); // Nếu không phải admin, điều hướng đến trang login
    }
  };

  return { navigateTo };
};

export default useNavigation;
