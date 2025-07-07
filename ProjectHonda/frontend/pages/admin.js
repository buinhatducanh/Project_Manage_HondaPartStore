import { useState, useEffect } from "react";
import withAuth from "../utils/withAuth";
import ProductItem from "../components/ProductItem";
const AdminPage = () => {

  return (
    <div className="m-5 min-h-screen bg-gray-800 border w-full h-full">
      <ProductItem />
    </div>
  );
};

export default withAuth(AdminPage, ["admin"]);
