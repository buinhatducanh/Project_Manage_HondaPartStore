import AdminSidebar from "./AdminSliderbar";

const AdminLayout = ({ children }) => {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    );
  };
  
  export default AdminLayout;
  