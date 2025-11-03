import React, { useState, useEffect } from "react";
import "./css/ProductUser.scss";
import { FaChevronUp, FaChevronDown, FaCheck } from "react-icons/fa";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

export default function ProductUser() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryNameFromUrl = searchParams.get("category");

  const reset = searchParams.get("reset");
  useEffect(() => {
    if (reset === "true") {
      setFilters({
        categories: [],
        materials: [],
        priceRange: {
          minPrice: 150000,
          maxPrice: 30000000,
        },
        colors: [],
        dimensions: [],
        topics: [],
      });

      axios
        .get("http://localhost:8888/api/v1/filters/products")
        .then((response) => setListFilters(response.data))
        .catch((error) => console.log("Lỗi khi reset filters:", error));

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("reset");
      newParams.delete("_");

      setSearchParams(newParams);
    }
  }, [reset, searchParams, setSearchParams]);

  const [listFilters, setListFilters] = useState({});
  const [filters, setFilters] = useState({
    categories: [],
    materials: [],
    priceRange: {
      minPrice: 150000,
      maxPrice: 30000000,
    },
    colors: [],
    dimensions: [],
    topics: [],
  });

  const fetchDynamicFilters = async (categories) => {
    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/filters/products-dynamic",
        { categories: categories }
      );
      setListFilters(response.data);
    } catch (error) {
      console.error("Lỗi khi tải lại filters động:", error);
    }
  };

  useEffect(() => {
    const fetchListFilters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/v1/filters/products"
        );
        setListFilters(response.data);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách filter: ", error);
      }
    };
    fetchListFilters();
  }, []);

  useEffect(() => {
    if (categoryNameFromUrl && listFilters.categories) {
      let foundCategory = null;

      foundCategory = listFilters.categories.find(
        (c) => c.name === categoryNameFromUrl
      );

      if (!foundCategory) {
        for (const parent of listFilters.categories) {
          foundCategory = parent.children?.find(
            (child) => child.name === categoryNameFromUrl
          );
          if (foundCategory) break;
        }
      }

      if (foundCategory) {
        const categoryId = foundCategory.id;

        if (!filters.categories.includes(categoryId)) {
          setFilters((prev) => {
            const newCategories = [categoryId];

            fetchDynamicFilters(newCategories);

            return {
              ...prev,
              categories: newCategories,
              materials: [],
              priceRange: { minPrice: 150000, maxPrice: 30000000 },
              colors: [],
              dimensions: [],
              topics: [],
            };
          });
        }
      }
    }
  }, [categoryNameFromUrl, filters.categories, listFilters.categories]);

  const handleArrayFilterChange = (key, value) => {
    setFilters((prev) => {
      if (key === "materials" || key === "dimensions" || key === "topics") {
        const currentArray = prev[key];
        const newArray = currentArray.includes(value)
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value];
        return { ...prev, [key]: newArray };
      }

      if (key === "categories") {
        const currentCategories = prev.categories;
        let newCategories;
        let categoryToUnselect = null;

        const parentOfValue = listFilters.categories?.find((c) =>
          c.children?.some((child) => child.id === value)
        );
        const isChild = !!parentOfValue;

        const parentCategory = listFilters.categories?.find(
          (c) => c.id === value
        );
        const isParent = !!parentCategory;

        if (currentCategories.includes(value)) {
          newCategories = currentCategories.filter((v) => v !== value);
        } else {
          newCategories = [...currentCategories, value];

          if (isChild) {
            if (currentCategories.includes(parentOfValue.id)) {
              categoryToUnselect = parentOfValue.id;
            }
          }
        }

        if (!currentCategories.includes(value) && isParent) {
          const childrenIds =
            parentCategory.children?.map((child) => child.id) || [];
          newCategories = newCategories.filter(
            (id) => !childrenIds.includes(id)
          );
        }

        let finalCategories = newCategories;
        if (categoryToUnselect) {
          finalCategories = finalCategories.filter(
            (v) => v !== categoryToUnselect
          );
        }

        fetchDynamicFilters(finalCategories);

        return {
          ...prev,
          categories: finalCategories,
          materials: [],
          priceRange: {
            minPrice: 150000,
            maxPrice: 30000000,
          },
          colors: [],
          dimensions: [],
          topics: [],
        };
      }

      return prev;
    });
  };

  const handleFiltersChangeColor = (key, value) => {
    setFilters((prev) => {
      if (key === "colors") {
        const colors = prev.colors.includes(value)
          ? prev.colors.filter((c) => c !== value)
          : [...prev.colors, value];

        return { ...prev, colors: colors };
      }
      return prev;
    });
  };

  useEffect(() => {
    console.log("check filter =>>>>>", filters);
  }, [filters]);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleMinChange = (e) => {
    const value = Math.min(
      Number(e.target.value),
      filters.priceRange.maxPrice - 500000
    );
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        minPrice: value,
      },
    }));
  };

  const handleMaxChange = (e) => {
    const value = Math.max(
      Number(e.target.value),
      filters.priceRange.minPrice + 500000
    );
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        maxPrice: value,
      },
    }));
  };

  const minPercent = (filters.priceRange.minPrice / 30000000) * 100;
  const maxPercent = (filters.priceRange.maxPrice / 30000000) * 100;

  const [closeTableColor, setCloseTableColor] = useState(true);
  const handleOpenCloseTable = () => setCloseTableColor(!closeTableColor);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: currentPage,
          size: pageSize,
          categories: filters.categories.join(","),
          materials: filters.materials.join(","),
          minPrice: filters.priceRange.minPrice,
          maxPrice: filters.priceRange.maxPrice,
          colors: filters.colors.join(","),
          dimensions: filters.dimensions.join(","),
          topics: filters.topics.join(","),
        };

        // ... (gọi api tìm kiếm sản phẩm)
        console.log("Params gửi API tìm kiếm:", params);
      } catch (error) {
        console.error("lỗi khi lọc sản phẩm: ", error);
      }
    };
    fetchProducts();
  }, [filters, currentPage, pageSize]);

  return (
    <div className="productUser-container">
      <div className="productUser-title">Tất Cả Sản Phẩm</div>
      <div className="productUser-content">
        <div className="productUser-filter">
          <div className="productUser-filter-title">Filters</div>
          <div className="productUser-filter-content">
            {listFilters.categories?.length > 0 &&
              listFilters.categories.map((item, index) => (
                <div className="categories-content" key={item.id}>
                  <div className="categories-content-name">
                    <FaChevronUp />
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(item.id)}
                      onChange={() =>
                        handleArrayFilterChange("categories", item.id)
                      }
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.children?.length > 0 &&
                    item.children.map((child, childIndex) => (
                      <div className="categories-content-child" key={child.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(child.id)}
                            onChange={() =>
                              handleArrayFilterChange("categories", child.id)
                            }
                          />
                          <span>{child.name}</span>
                        </label>
                      </div>
                    ))}
                </div>
              ))}

            <div className="materials-content">
              <div className="materials-content-name">
                <FaChevronUp /> <span>Chất Liệu</span>
              </div>
              {listFilters.materials?.length > 0 &&
                listFilters.materials.map((item, index) => (
                  <div className="materials-content-child" key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(item.id)}
                        onChange={() =>
                          handleArrayFilterChange("materials", item.id)
                        }
                      />
                      <span>{item.materialname}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="price-item item">
              <div className="price-item_title">
                <FaChevronUp /> <span>Giá</span>
              </div>
              <div className="price-item_slide">
                <div className="slider-container">
                  <div
                    className="slider-track"
                    style={{
                      background: `linear-gradient(to right, #d1d5db ${minPercent}%, #06b6d4 ${minPercent}%, #06b6d4 ${maxPercent}%, #d1d5db ${maxPercent}%)`,
                    }}
                  ></div>
                  <input
                    type="range"
                    min="150000"
                    max="30000000"
                    value={filters.priceRange.minPrice}
                    onChange={handleMinChange}
                    className="range min-range"
                  />
                  <input
                    type="range"
                    min="150000"
                    max="30000000"
                    value={filters.priceRange.maxPrice}
                    onChange={handleMaxChange}
                    className="range max-range"
                  />
                </div>
                <div className="price-info">
                  <span>{formatCurrency(filters.priceRange.minPrice)}</span> —{" "}
                  <span>{formatCurrency(filters.priceRange.maxPrice)}</span>
                </div>
              </div>
            </div>

            <div className="color-item item">
              <div className="color-item_title" onClick={handleOpenCloseTable}>
                {closeTableColor ? (
                  <FaChevronUp className="open-close-icon" />
                ) : (
                  <FaChevronDown className="open-close-icon" />
                )}
                <span>Màu Sắc</span>
              </div>

              <div
                className={`color-item_table ${
                  !closeTableColor ? "open" : "close"
                }`}
              >
                {listFilters.colors?.length > 0 &&
                  listFilters.colors.map((item, index) => (
                    <div
                      key={index}
                      className="color"
                      style={{ background: item }}
                      onClick={() => handleFiltersChangeColor("colors", item)}
                    >
                      <FaCheck
                        className={`ticked-color ${
                          !filters.colors.includes(item) ? "hide" : "show"
                        }`}
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="dimensions-content">
              <div className="dimensions-title">
                <FaChevronUp /> <span>Kích Thước</span>
              </div>
              {listFilters.dimensions?.length > 0 &&
                listFilters.dimensions.map((item, index) => (
                  <div className="dimensions-item" key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.dimensions.includes(item)}
                        onChange={() =>
                          handleArrayFilterChange("dimensions", item)
                        }
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
            </div>

            <div className="topics-content">
              <div className="topics-title">
                <FaChevronUp /> <span>Chủ Đề</span>
              </div>
              {listFilters.topics?.length > 0 &&
                listFilters.topics.map((item, index) => (
                  <div className="topics-item" key={item}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.topics.includes(item)}
                        onChange={() => handleArrayFilterChange("topics", item)}
                      />
                      <span>{item}</span>
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="productUser-showProduct">hiển thị sản phẩm</div>
      </div>
    </div>
  );
}
