import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductUser from "../../../components/product/ProductUser/ProductUser";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const sortType = searchParams.get("sort");


  const getPageTitle = () => {
    switch (sortType) {
      case "featured":
        return "Sản Phẩm Nổi Bật";
      case "newest":
        return "Sản Phẩm Mới Nhất";
      case "bestseller":
        return "Sản Phẩm Bán Chạy";
      case "on-sale":
        return "Sản Phẩm Khuyến Mãi";
      default:
        return "Tất Cả Sản Phẩm";
    }
  };

  const getApiEndpoint = () => {
    switch (sortType) {
      case "featured":
        return "featured";
      case "newest":
        return "newest";
      case "on-sale":
        return "on-sale";
      default:
        return null;
    }
  };

  const getInitialSort = () => {
    switch (sortType) {
      case "bestseller":
        return "salesCount,desc";
      case "on-sale":
        return "discount,desc";
      default:
        return "createdAt,desc";
    }
  };

  return (
    <ProductUser 
      pageTitle={getPageTitle()}
      hideFilters={false}
      showSearch={false}
      apiEndpoint={getApiEndpoint()}
      initialSort={getInitialSort()}
    />
  );
}