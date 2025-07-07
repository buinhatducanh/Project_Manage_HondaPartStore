
import withAuth from "../../utils/withAuth";
import AdminProducts from "../../components/admin/AdminProducts";

const ProductPage = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      <div className={`container p-6 transition-all duration-300`}>
        <div className="h-[200vh]"> {/* Tạo nội dung dài để dễ thử nghiệm */}
          <AdminProducts />
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProductPage, ["admin"]);
