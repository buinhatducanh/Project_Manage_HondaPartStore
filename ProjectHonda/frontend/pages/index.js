import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import SlideAds from "../components/SlideAds";
import { ProductList } from "../components/ProductList";
import Section from "../components/ui/Section";

const Home = () => {
  const { cart } = useCart();
  const [products, setProducts] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [brands, setBrands] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(
          "http://localhost:5000/api/products"
        );
       
        const brandRes = await axios.get("http://localhost:5000/api/brands"); // Lấy danh sách brands
        const categorieRes = await axios.get(
          "http://localhost:5000/api/categories"
        );

        const productData = productRes.data;
        const brandData = brandRes.data;
        const categorieData = categorieRes.data;

        setProducts(productData);
        setBrands(brandData);
        setCategories(categorieData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="p-[12%] size-14 h-auto"></div>
        <SlideAds className="size-14 grow" />
        <div className="p-[2%] size-14 h-auto"></div>
      </div>

      <Section title="Sản phẩm trong kho giảm cực sốc">
        {loading ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
        ) : (
          <ProductList products={products} />
        )}
      </Section>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => router.push("/cart")}
      >
        🛒 Xem giỏ hàng ({cart.length})
      </button>
    </div>
  );
};

export default Home;
