import React, { useRef, useState, useEffect } from "react";
import "./css/ProductUser.scss";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

export default function ProductUser() {
  const priceContentRef = useRef(null);
  const styleContentRef = useRef(null);

  const [openStates, setOpenStates] = useState({
    price: true,
    style: true,
  });

  const arrayFilter = [
    {
      id: 1,
      name: "GIÁ",
      key: "price",
      value: ["0 - 1000000", "1000000 - 2000000", "2000000 - 5000000"],
    },
    {
      id: 2,
      name: "PHONG CÁCH",
      key: "style",
      value: ["Ấn tượng", "Trừu Tượng", "Tân Cổ Điển"],
    },
  ];

  const formatFilterValue = (value) => {
    const parts = value.split(" - ");
    const formattedParts = parts.map((part) => {
      const number = parseInt(part.trim());
      if (!isNaN(number)) {
        return number.toLocaleString("vi-VN");
      }
      return part;
    });
    return formattedParts.join(" - ");
  };

  const handleOpenContent = (key) => {
    let contentRef;
    if (key === "price") {
      contentRef = priceContentRef;
    } else if (key === "style") {
      contentRef = styleContentRef;
    }

    if (contentRef && contentRef.current) {
      contentRef.current.classList.toggle("close");
    }

    setOpenStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [filters, setFilters] = useState({
    price: [],
    style: [],
  });

  const handleFiltersChange = (key, value, checked) => {
    setFilters((prev) => {
      const currentArray = prev[key];
      let updateArray;
      if (checked) {
        updateArray = [...currentArray, value];
      } else {
        updateArray = currentArray.filter((item) => item !== value);
      }
      return {
        ...prev,
        [key]: updateArray,
      };
    });
  };

  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("category");
  const [filterKey, setFilterKey] = useState(0);

  useEffect(() => {
    setFilters({
      price: [],
      style: [],
    });

    setFilterKey((prevKey) => prevKey + 1);

    // setCurrentPage(0);
  }, [categoryName]);

  useEffect(() => {
    console.log("check filter =>>>>>", filters);
  }, [filters]);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          categoryName: categoryName || "all",
          ...(filters.price && { price: filters.price }),
          ...(filters.style && { style: filters.style }),
        };

        // ... (gọi api truyền params vào)
        // const response = await axios.get("link lấy sản phẩm", { params });
        // setProducts(response.data.content);
        // setTotalPages(response.data.totalPages);
        console.log("check params ====>>>> ", params);
      } catch (error) {
        console.error("lỗi khi lọc sản phẩm: ", error);
      }
    };
    fetchProducts();
  }, [filters, currentPage, pageSize, categoryName]);

  return (
    <div className="productUser-container">
      <div className="productUser-title">
        {categoryName || "Tất Cả Sản Phẩm"}
      </div>
      <div className="productUser-content">
        <div className="productUser-filter">
          <div className="productUser-filter-title">Filters</div>
          <div className="productUser-filter-content" key={filterKey}>
            {arrayFilter &&
              arrayFilter.length > 0 &&
              arrayFilter.map((item) => {
                let contentRef;
                if (item.key === "price") {
                  contentRef = priceContentRef;
                } else if (item.key === "style") {
                  contentRef = styleContentRef;
                }

                return (
                  <div className="filter-item" key={item.id}>
                    <div
                      className="filter-item_name"
                      onClick={() => handleOpenContent(item.key)}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {openStates[item.key] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}{" "}
                        {item.name}
                      </span>
                    </div>
                    <div className="filter-item_content" ref={contentRef}>
                      {item.value &&
                        item.value.length > 0 &&
                        item.value.map((itemValue) => (
                          <label key={itemValue}>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <input
                                type="checkbox"
                                className="input-checkbox"
                                value={itemValue}
                                onChange={(e) =>
                                  handleFiltersChange(
                                    item.key,
                                    e.target.value.trim(),
                                    e.target.checked
                                  )
                                }
                                checked={filters[item.key].includes(
                                  itemValue.trim()
                                )}
                              />{" "}
                              {item.key === "price"
                                ? formatFilterValue(itemValue.trim())
                                : itemValue}
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="productUser-showProduct">hiển thị sản phẩm</div>
      </div>
    </div>
  );
}
